pragma solidity ^0.8.0;
import "./_validators_hub.sol"; 
import "./Hashurance_T.sol";        //Imports Hashurance token
import "./policy_contract.sol";     //Imports policy contract to create and manage policies.

contract _Insurengine{
     //Hushurance token contract object.
    HashuranceToken public hashuranceToken;
    
     //Holds the entire policies in the protocol.
    Policy[] public policyArchieve;

     //Validators hub contract object.
    voteNvalidate public validatorsHub;

     //Stores all insurance applications, before they get approved and transformed to a policy.
    ApplicationForm[] public applications;

  struct ApplicationForm{
      address applicant;       //Who is applying to be insured
      string whatToInsure;     // Will convert to bytes later. //What item do you want to insure.
      uint estimatedCost;      //What's your personal valuaton of this item.
      uint applicationTime;    //Time of application.
      uint toApproveCount;     //Number of validators who approved this application.
      uint toDenyCount;        //Number of validators who declined this application. 
      uint finalDecision;      //0 = not decided, 2 = Declined, 4 = Approved.
      string reasonForDenial;  //Possible reasons for a rejection.
      uint applicationID;      //Application Id.
      uint prequelID;          //Previous application Id if this is a re-application.
    }

  struct receiptTemplate{
        uint blockNumber;
        address from_;
        address to_;
        address receiver;
        uint paymentTime;
        uint value;
        uint transactionHash;
    }

  constructor(address vHubAddress){
      hashuranceToken = new HashuranceToken(msg.sender); //Creates instance of Hashurance token.
      validatorsHub = voteNvalidate(vHubAddress);
      }

   //Function to apply for an insurance.
   // @prequel should be 0 if its a fresh insurance application.
  function applyForInsurance(string memory insuring, uint cost, uint prequel, receiptTemplate memory receipt) public returns(bool){
      //Transfer BUSD to Hashurance Engine at frontend and wait for a response (transaction hash).
      //Use the response to create a receipt then call this function.

      //Confirm payment of BUSD from the CALLER of this function (applicant).
      //Use the response to send (separate and lock) the Hashsurance token equivalent of BUSD that was sent by the applicant.
      HashuranceToken.receiptTemplate memory receipt_toToken;  //Expensive means, but it can work till we find an alternative. 
      receipt_toToken.from_ = receipt.from_;
      receipt_toToken.to_ = receipt.to_;
      receipt_toToken.paymentTime = block.timestamp;
      receipt_toToken.receiver = receipt.receiver;
      receipt_toToken.value = receipt.value;
      receipt_toToken.transactionHash = receipt.transactionHash;
      hashuranceToken.updateDepoPool(applications.length, receipt_toToken);//////////////////

       //Submit application after successful transfer
      ApplicationForm memory newApplicationForm = ApplicationForm(msg.sender, insuring, cost, block.timestamp, 0, 0, 0, "N/A", applications.length, prequel); //Application form filled, with approved variable set to false.
      applications.push(newApplicationForm);

       //Add user to validator's court, since he now has hashurance tokens locked within the contract.
      validatorsHub.addToCourt(msg.sender, receipt.value);/////////////////
      return true;
  }

  function getAppication(uint applId)public view returns(ApplicationForm memory){
      ApplicationForm memory form = applications[applId];
      return form;
  }

  function preForInspection(uint aFormID, uint decision, string memory reason)public returns(bool){
      ApplicationForm memory aForm = applications[aFormID];
      aForm.reasonForDenial = reason; //Save the lastest reason, if its not empty.
      uint[3] memory returnedValues = validatorsHub.inspect(aFormID,decision, aForm.toApproveCount, aForm.toDenyCount, aForm.finalDecision);
      aForm.toApproveCount = returnedValues[0];
      aForm.toDenyCount = returnedValues[1];
      aForm.finalDecision = returnedValues[2];
      applications[aFormID] = aForm;
      if(aForm.finalDecision == 4){
          createPolicy(aFormID); //Creates policy if the final Decision is approved.
      }
      return true;
  }

  function createPolicy(uint applId) private{
      ApplicationForm memory approvedApplication = applications[applId];
      require(approvedApplication.finalDecision == 4, "Not approved");  //If its approved;
      HashuranceToken.receiptTemplate memory template = hashuranceToken.getReceipt(applId);
      Policy policy_ = new Policy(
          approvedApplication.applicant, 
          applId, 
          approvedApplication.whatToInsure, 
          approvedApplication.estimatedCost,
          template.value,
          template.paymentTime);
      policy_.computeVariables();
      policyArchieve.push(policy_);
      //Release funds form HSHT.
  }
}