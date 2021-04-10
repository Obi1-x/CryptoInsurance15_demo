pragma solidity ^0.8.0;
import "./Hashurance_engine.sol"; 

contract VotesAndValidations{
    uint public numOfValidators; 
    mapping(address=>uint)public validators; //Hashurance token holder addresses and validator's reputation.
    
    //ClaimApplications[] claim applications  
    Insurengine.ApplicationForm[] public policyApplications;

    constructor(address referenceEngine){
        numOfValidators = 0;
        policyApplications = referenceEngine.applications();
    }

    function inspect(Insurengine.ApplicationForm[] memory theForm, bool decision, string memory reason)public{
      if(decision){
          theForm.toApproveCount++;
      }else if(!decision){
          theForm.toDenyCount++;
          theForm.reasonForDenial = reason;
      }
    }

    function addToCourt(address newValidator, uint value)public{
        //Validator's reputation = (Number of good inspection * 1000000) + Hashurance token balance. 
        //Number of good inspection = 0, for new applicants.
        validators[newValidator] = value; //value 
        numOfValidators++;
    }

    function vote() public{

    }
}