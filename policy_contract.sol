pragma solidity ^0.8.0;

contract Policy{
  address public PolicyHolder;
  uint public ApprovedapplyId;
  string public InsuredItem;
  uint public CreationTime;
  uint public Principal;        //The amount we will pay back after a claim
   //Time of Payment => Amount paid
  mapping(uint => uint) public premiumHistory; //History of premium payment.
  uint public premPaymentCount;

  uint public predictedTenure;  //How long the policy will last in months before a claim.
  uint public nextPremium;      //The amount of stablecoin the policy holder will pay next.
  uint public premiumDeadline;
  uint public Rprofit; //a constant

  constructor(
      address holder, 
      uint applyId, 
      string memory insured, 
      uint principal,
      uint intialPayment,
      uint paymentTime){
    PolicyHolder = holder;
    ApprovedapplyId = applyId;
    InsuredItem = insured;
    CreationTime = block.timestamp;
    Principal = principal;
    premiumHistory[paymentTime] = intialPayment;
    premiumDeadline = CreationTime + 2592000;//1 month from now
    premPaymentCount++;
    //Rprofit = 0.3 * principal;
  }

  function computeVariables() public{
      require(premiumDeadline < block.timestamp); //Might change this.
       //Estimate and predict the policy period or tenure.
      predictedTenure = 12;
       //Compute the next premium amount.
      nextPremium = 150; //Principal / predictedTenure;
       //Compute prmium deadline.
      premiumDeadline += 2592000;//1 month from now.
    }

  function validityStatus() public view returns(string memory validity){
      if(block.timestamp - CreationTime > 2592000){ //One month in UNIX timestamp
          validity = "Invalid";
        } else if(block.timestamp - CreationTime < 2592000){
            validity = "Valid";
        }
    }
}