pragma solidity ^0.8.0;
import "./validators_hub.sol"; 
import "./Hashurance_T.sol";        //Imports Hashurance token
import "./policy_contract.sol";     //Imports policy contract to create and manage policies.

contract Insurengine{
    //Hushurance token contract object.
    HashuranceToken private hashuranceToken;
    
    //Holds the entire policies in the protocol.
    Policy[] public policyArchieve;

    //Validators hub contract object.
    VotesAndValidations public validatorsHub;

    //Stores all insurance applications, before they get approved and transformed to a policy.
    ApplicationForm[] public applications;

  struct ApplicationForm{
      address applicant;       //Who is applying to be insured
      string whatToInsure;     // Will convert to bytes later. //What item do you want to insure.
      uint estimatedCost;      //What's your personal valuaton of this item.
      uint applicationTime;    //Time of application.
      uint toApproveCount;     //Number of validators who approved this application.
      uint toDenyCount;        //Number of validators who declined this application. 
      bool approved;           //Decision after validators inspection. False = not approved, True = Approved.
      string reasonForDenial;  //Possible reasons for a rejection.
      uint applicationID;      //Application Id.
      uint prequelID;          //Previous application Id if this is a re-application.
    }

  struct receiptTemplate{
        uint blockNumber;
        address from_;
        address to_;
        address receiver;
        uint value;
        uint transactionHash;
    }

  constructor(address vHubAddress){
      hashuranceToken = new HashuranceToken(msg.sender); //Creates instance of Hashurance token.
      validatorsHub = VotesAndValidations(vHubAddress);
      }

  //Function to apply for an insurance.
  // @prequel should be 0 if its a fresh insurance application.
  function applyForInsurance(string memory insuring, uint cost, uint prequel, receiptTemplate memory receipt) public returns(bool){
      //Transfer BUSD to Hashurance Engine at frontend and wait for a response (transaction hash).
      //Use the response to create a receipt then call this function.

      //Confirm payment of BUSD from the CALLER of this function (applicant).
      //Use the response to send (separate and lock) the Hashsurance token equivalent of BUSD that was sent by the applicant.
      hashuranceToken.updateDepoPool(receipt.value, receipt);

      //Submit application after successful transfer
      ApplicationForm memory newApplicationForm = ApplicationForm(msg.sender, insuring, cost, block.timestamp, 0, 0, false, "N/A", applications.length, prequel); //Application form filled, with approved variable set to false.
      applications.push(newApplicationForm);

      //Add user to validator's court, since he now has hashurance tokens locked within the contract.
      validatorsHub.addToCourt(msg.sender, receipt.value);
      return true;
  }

  function getAppication(uint applId)public view returns(ApplicationForm memory){
      ApplicationForm memory form = applications[applId];
      return form;
  }

  function createPolicy(uint applId) private{
      //require to be called by validaotrs hub
      ApplicationForm memory approvedApplication = applications[applId];
      Policy policy_ = new Policy(msg.sender, applId, approvedApplication.whatToInsure, approvedApplication.estimatedCost);
      policy_.computeVariables();
      policyArchieve.push(policy_);
  }

  //Validators_hub=======================================================================================================
  function inspect(uint applId, bool decision, string memory reason)public{
      //Require msg.sender to be a validator.
      ApplicationForm memory theForm = applications[applId];
      if(decision){
          theForm.toApproveCount++;
      }else if(!decision){
          theForm.toDenyCount++;
          theForm.reasonForDenial = reason;
      }
  }
}
