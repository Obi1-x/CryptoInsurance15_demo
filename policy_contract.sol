pragma solidity ^0.8.0;

contract Policy{
  address public PolicyHolder;
  uint public ApprovedapplyId;
  string public InsuredItem;
  uint public CreationTime;

  uint public Principal;        //The amount we will pay back after a claim
  uint public predictedTenure;  //How long the policy will last in months before a claim.
  uint public nextPremium;      //The amount of stablecoin the policy holder will pay next.
  uint public premPaymentCount;
  uint public Rprofit; //a constant

  mapping(uint => uint) public premiumHistory; //History of premium payment.

  constructor(address holder, uint applyId, string memory insured, uint principal){
    PolicyHolder = holder;
    ApprovedapplyId = applyId;
    InsuredItem = insured;
    CreationTime = block.timestamp;
    Principal = principal;
  }

  function computeVariables() public{
      //Estimate and predict the policy period or tenure.
      predictedTenure = 12;
      nextPremium = Principal / predictedTenure;

  }
}