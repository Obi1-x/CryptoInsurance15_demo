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

  function getAppication(uint applId)public view returns(ApplicationForm memory){
      ApplicationForm memory form = applications[applId];
      return form;
    }

  function submitPremium(address policyAddress, receiptTemplate memory receipt, uint direction)public returns(bool){
       //Confirm and process funds.
       receipt.paymentTime = block.timestamp; //Will later change this to the timestamp returned at the front end.
       hashuranceToken.transfer(policyAddress, receipt.value); //Move HSHT to policy contract.
       Policy destinationPolicy = Policy(policyAddress);
       destinationPolicy.logPremiumHistory(receipt.paymentTime, receipt.value);
       if(direction == 3){ //True when its time to withdraw.
           //Transfer principal amount of tokens from policy account to holder's account.
           hashuranceToken.transferFrom(policyAddress, destinationPolicy.policy_Holder(), destinationPolicy.Principal());
       }
       return true;
  }

   //Function to apply for an insurance.
   // @prequel should be 0 if its a fresh insurance application.
  function applyForInsurance(string memory insuring, uint cost, uint prequel, receiptTemplate memory receipt) public returns(bool){
       //Confirm and process funds.
       receipt.paymentTime = block.timestamp;
      hashuranceToken.updateDepoPool(applications.length, reformReceipt(receipt));

       //Submit application after successful transfer
      ApplicationForm memory newApplicationForm = ApplicationForm(msg.sender, insuring, cost, block.timestamp, 0, 0, 0, "N/A", applications.length, prequel); //Application form filled, with approved variable set to false.
      applications.push(newApplicationForm);

       //Add user to validator's court, since he now has hashurance tokens locked within the contract.
      validatorsHub.addToCourt(msg.sender, receipt.value);/////////////////
      return true;
    }

    function reformReceipt(receiptTemplate memory receipt)private view returns(HashuranceToken.receiptTemplate memory){
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
      return receipt_toToken;
  }

  function prepForInspection(uint aFormID, uint decision, string memory reason)public returns(bool){
      ApplicationForm memory aForm = applications[aFormID];
      aForm.reasonForDenial = reason; //Save the lastest reason, if its not empty.
      uint[3] memory returnedValues = validatorsHub.inspect(aFormID,decision, aForm.toApproveCount, aForm.toDenyCount);
      aForm.toApproveCount = returnedValues[0];
      aForm.toDenyCount = returnedValues[1];
      aForm.finalDecision = returnedValues[2];
      if(aForm.finalDecision == 4){
           //Clear reasons for denial, entered by validators, if the application was approved.
          aForm.reasonForDenial = "N/A";
      }
      applications[aFormID] = aForm;
      return true;
  }

  function prepForClaimInspection(address policyAddress, uint decision, string memory reason)public returns(bool){
      Policy destinationPolicy = Policy(policyAddress);
      uint[3] memory returnedValues = validatorsHub.inspectClaimRequest(
          policyAddress,
          decision,
          destinationPolicy.toApproveCount(),
          destinationPolicy.toDenyCount());
      destinationPolicy.enterInspectionResult(returnedValues[0], returnedValues[1], returnedValues[2]);
      destinationPolicy.prepForWithdrawal(address(hashuranceToken));
      return true;
  }

  function createPolicy(uint applId) public{
      ApplicationForm memory approvedApplication = applications[applId]; //Might conme back to this later.
      require(msg.sender == approvedApplication.applicant, "Not the applicant");
      require(approvedApplication.finalDecision == 4, "Not approved");  //If its approved;
      HashuranceToken.receiptTemplate memory template = hashuranceToken.getReceipt(applId);
      Policy policy_ = new Policy(
          approvedApplication.applicant, 
          applId, 
          approvedApplication.whatToInsure, 
          approvedApplication.estimatedCost,
          template.value,
          template.paymentTime,
          address(hashuranceToken));
      policy_.computeVariables();
      policyArchieve.push(policy_);
       //Release equivalent HSHT funds, previously minted, to newly created policy contract.
      hashuranceToken.purgeDepoPool(applId, address(policy_), template.value);
    }

    function claimInsurance(address policyAddress)public{
        Policy destinationPolicy = Policy(policyAddress);
         //Ensures the claimer is the holder of this policy.
        require(msg.sender == destinationPolicy.policy_Holder(), "Cannot claim!");
        destinationPolicy.claim();
    }

    function withdrawFromPolicy(address policyAddress)public{
        Policy destinationPolicy = Policy(policyAddress);
         //Ensures the claimer is the holder of this policy.
        require(msg.sender == destinationPolicy.policy_Holder(), "Restricted!");
        hashuranceToken.transferFrom(address(destinationPolicy), destinationPolicy.policy_Holder(), destinationPolicy.Principal());
    }
}