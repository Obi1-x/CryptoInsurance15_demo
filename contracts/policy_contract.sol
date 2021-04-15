pragma solidity ^0.8.0;
import "./Hashurance_T.sol";        //Imports Hashurance token

contract Policy{
  uint public ApprovedapplyId;
  address public policy_Holder;
  string public InsuredItem;
  uint public CreationTime;
  uint public Principal;        //The amount we will pay back after a claim
   //Time of Payment => Amount paid
  mapping(uint => uint) public premiumHistory; //History of premium payment.
  uint[] public totalPremiumPaid;
  address public HSHTAddress;

  uint public predictedTenure;  //How long the policy will last in months before a claim.
  uint public nextPremium;      //The amount of stablecoin the policy holder will pay next.
  uint public premiumDeadline;
  uint public Rprofit; //a constant

  uint[] public claimRequestCount; //Used to signify and track claims by policy holders.
  uint public toApproveCount;     //Number of validators who approved this application.
  uint public toDenyCount;        //Number of validators who declined this application. 
  uint public finalDecision;      //0 = not decided, 2 = Declined, 4 = Approved.
  string public reasonForDenial;  //Possible reasons for a rejection.

  constructor(
      address holder, 
      uint applyId, 
      string memory insured, 
      uint principal,
      uint initialPayment,
      uint paymentTime,
      address HSHTaddress){
    policy_Holder = holder;
    ApprovedapplyId = applyId;
    InsuredItem = insured;
    CreationTime = block.timestamp;
    Principal = principal;
    premiumHistory[paymentTime] = initialPayment;
    premiumDeadline = CreationTime + 2592000;//1 month from now
    totalPremiumPaid.push(initialPayment);
    //Rprofit = 0.3 * principal;
    HSHTAddress = HSHTaddress;
  }

    function claim()public returns(bool){
        require(msg.sender == policy_Holder, "Cannot claim!!");
        claimRequestCount.push(block.timestamp);
    }

    function logPremiumHistory(uint payTime, uint payAmount)public{
        require(msg.sender == policy_Holder); //Restricts access to this function.
        premiumHistory[payTime] = payAmount;
        computeVariables();
    }
    
    function getNextPaymentTime()public view returns(uint){
        return premiumDeadline;
    }

    function getNextPaymentAmount()public view returns(uint){
        return nextPremium;
    }
    
    function validityStatus() public view returns(string memory validity){
      if(block.timestamp - CreationTime > 2592000){ //One month in UNIX timestamp
          validity = "Invalid";
        } else if(block.timestamp - CreationTime < 2592000){
            validity = "Valid";
        }
    }

    function computeVariables() public{
      //require(premiumDeadline < block.timestamp); //Might change this.
       //Estimate and predict the policy period or tenure.
      predictedTenure = 12;
       //Compute the next premium amount.
      nextPremium = 150; //Principal / predictedTenure;
       //Compute prmium deadline.
       if(block.timestamp > premiumDeadline){
           premiumDeadline += 2592000;//1 month from now.
       }
    }

    function enterInspectionResult(uint toApproveCount, uint toDenyCount, uint finalDecision)public{
        //Find another way to secure this function
        require(claimRequestCount.length > 0);
        if(finalDecision == 4){
           //Clear reasons for denial, entered by validators, if the application was approved.
          reasonForDenial = "N/A";
        }
    }

    function prepForWithdrawal(address HSHTAddress)public{
        require(claimRequestCount.length > 0);
        HashuranceToken HSHTobject = HashuranceToken(HSHTAddress);
        //Checks which case has occurred.
        if(totalPremiumPaid.length <= Principal){
            //Case 1: Total Pm < P.
            //Case 2: Total Pm = P.
            nextPremium = 200; //Ask for Rprofit(deductible) to be paid in BUSD.
            //Pay policy holder all HSHT that's in the policy account.
            //Minter should balance up.
        }/*else if(totalPremiumPaid.length > Principal){
            //Case 3: Total Pm > P.
            //Dont ask for Rprofit.
            //Pay policy holder principal amount of HSHT, from policy account.
        }*/

        //Call HSHT contract and approve Hashurance engine to transfer the principal amount.
        HSHTobject.approve(policy_Holder, Principal);
        //HSHTAddress.call(approve, policy_Holder, principal);
    }
    function getPolicyHolder()public view returns(address){
        return policy_Holder;
    }
}