pragma solidity ^0.8.0;
import "./Hashurance_engine.sol"; 

contract VotesAndValidations{
    address[] public validators;
    //ClaimApplications[] claim applications  
    Insurengine.ApplicationForm[] public policyApplications;

    constructor(address referenceEngine){
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

    function vote() public{

    }
}