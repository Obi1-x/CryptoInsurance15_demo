pragma solidity ^0.8.0;
//import "./Hashsurance_T.sol";   //Imports token contracts from finance department.
import "./policy_contract.sol"; //Imports policy contract to create and manage policies.

contract Insurengine{
  //Holds the entire policies in the protocol.
  Policy[] public policyArchieve;

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

  //Function to apply for an insurance.
  // @prequel should be 0 if its a fresh insurance application.
  function applyForInsurance(string memory insuring, uint cost, uint prequel) public returns(bool){
      ApplicationForm memory newApplicationForm = ApplicationForm(msg.sender, insuring, cost, block.timestamp, 0, 0, false, "N/A", applications.length, prequel); //Application form filled, with approved variable set to false.
      applications.push(newApplicationForm);
      //Make initial deposit of 10% the estimated cost.
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
