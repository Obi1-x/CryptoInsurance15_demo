pragma solidity ^0.8.0;

contract voteNvalidate{
    uint public numOfValidators; 
    mapping(address=>uint)public validators; //Hashurance token holder addresses and validator's reputation.
    mapping(address=>mapping(uint=>uint)) public validationRegister; //Used to avoid a prevent a validator from validating more than once.
    //ClaimApplications[] claim applications
    
    function getTotalValidations(uint appr, uint deny)private pure returns(uint){
        return appr + deny;
    }

    function inspect(
        uint appId, 
        uint decision, 
        uint approveCount, 
        uint denyCount) public returns(uint[3] memory){
        require(validators[msg.sender] > 0); //Makes sure only validators can inspect (i.e rank > 0).
        require(getTotalValidations(approveCount, denyCount) < numOfValidators); //Checks if the form is still open for validations. Might promote to modifier. 
        
        //Check if msg.sender has applied before.
        uint preDecision = validationRegister[msg.sender][appId];
        require(preDecision != 4 || preDecision != 2); //Hasnt inspected before.
        
        //Inspection
        if(decision == 4){ //Approve.
          approveCount++;
          validationRegister[msg.sender][appId] = 4; // 1 = true
        }else if(decision == 2){ //Reject.
          denyCount++;
          validationRegister[msg.sender][appId] = 2; // 2 = false
        }

        //Makes final decision.
        uint finalDeci = 0;
        if(getTotalValidations(approveCount, denyCount) == numOfValidators && approveCount != denyCount){ //If All validators has inspected and the results arent equal.
          //Judge
          if(approveCount > denyCount){ //Approval.
              finalDeci = 4;
            }else if(approveCount < denyCount){ //Rejection.
              finalDeci = 2;
            }
        }
        //Update return values.
        uint[3] memory report;
        report[0] = approveCount;
        report[1] = denyCount;
        report[2] = finalDeci;
        return report;
    }

    function inspectClaimRequest(
        address policyAddress, 
        uint decision, 
        uint approveCount, 
        uint denyCount) public returns(uint[3] memory){
        require(validators[msg.sender] > 0); //Makes sure only validators can inspect (i.e rank > 0).
        require(getTotalValidations(approveCount, denyCount) < numOfValidators); //Checks if the form is still open for validations. Might promote to modifier. 
        
        //Check if msg.sender has applied before.

        //Inspection
        if(decision == 4){ //Approve.
          approveCount++;
          //validationRegister[msg.sender][appId] = 4; // 1 = true
        }else if(decision == 2){ //Reject.
          denyCount++;
          //validationRegister[msg.sender][appId] = 2; // 2 = false
        }

        //Makes final decision.
        uint finalDeci = 0;
        if(getTotalValidations(approveCount, denyCount) == numOfValidators && approveCount != denyCount){ //If All validators has inspected and the results arent equal.
          //Judge
          if(approveCount > denyCount){ //Approval.
              finalDeci = 4;
            }else if(approveCount < denyCount){ //Rejection.
              finalDeci = 2;
            }
        }
        //Update return values.
        uint[3] memory report;
        report[0] = approveCount;
        report[1] = denyCount;
        report[2] = finalDeci;
        return report;
    }


    //Adds a new validator to the validators hub.
    function addToCourt(address newValidator, uint value)public{
        //Validator's reputation = (Number of good inspection * 1000000) + Hashurance token balance. 
        //Number of good inspection = 0, for new applicants.
        validators[newValidator] = value; //value 
        numOfValidators++;
    }

    function vote() public{

    }
}