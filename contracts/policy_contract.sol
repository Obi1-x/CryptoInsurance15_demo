// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Policy{
  address policyHolder;
  uint principal;

  constructor(address owner){
    policyHolder = owner;
  }
}