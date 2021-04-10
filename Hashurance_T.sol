pragma solidity ^0.8.0;

contract HashuranceToken{
    address public Curator;
    string  public name = "Hashurance Token";                      
    string  public symbol = "HSHT";                             
    uint256 public totalSupply_ = 2100000000000000000000000; //8 groups of 3zeros.
    uint256 public circulatingSupply_;
    uint8   public decimals = 18;
    uint256 public initDepositesTotal; 
    mapping(address=>uint256) public balances;
    mapping(address=>mapping(address=>uint256)) public allowed;
    //Payment references to BUSD deposites;
    mapping(uint=>receiptTemplate)public receipts;  //Still not so secure.

    struct receiptTemplate{
        uint blockNumber;
        address from_;
        address to_;
        address receiver;
        uint value;
        uint transactionHash;
    }

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    event Pendings(
        address indexed _from,
        uint256 _value
    );

    //Hashurance engine will create hashsurance token and become owner (curator).
    //Insurance engine token will be minted by this contract tranferring to users addresses
    //and burnt by doing the reverse.
    constructor(address owner) public{
        Curator = owner;
        balances[owner] = totalSupply_;
        circulatingSupply_ = 0;
        initDepositesTotal = 0;
    }

    modifier onlyCurator{
        require(msg.sender == Curator);
        _;
    }

    // Return total amount of tokens
    function totalSupply() public view returns(uint256){
        return totalSupply_;
    }

    // Return total amount of tokens in Circulation.
    function circulatingSupply() public view returns (uint256) {
        return circulatingSupply_;
    }

    function balanceOf(address _owner) public view returns(uint256){
        return balances[_owner];
    }

    function getReceipt(uint txHash)public view returns(receiptTemplate memory){
        return receipts[txHash];
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function approve(address _spender, uint256 _value) public returns(bool success){
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transfer(address _to, uint256 _value) public returns(bool success){
        //require(msg.sender != _to); //Avoids sending to yourself and wasting gas. Promote to modifier.
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        if(msg.sender == Curator){ //Curator is sending tokens out.
            //Increase the number of tokens in circulation, by _value.
            circulatingSupply_ += _value;
        }else if(_to == Curator){ //If someone sends to curator.
            circulatingSupply_ -= _value;
        }
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        //require(_from != _to); //Avoids sending to yourself and wasting gas. Promote to modifier.
        require(_value <= balances[_from]);
        require(_value <= allowed[_from][msg.sender]);
        balances[_from] -= _value;
        balances[_to] += _value;
        allowed[_from][msg.sender] -= _value;
        if(_from == Curator){ //Curator is sending tokens out.
            //Increase the number of tokens in circulation, by _value.
            circulatingSupply_ += _value;
        }else if(_to == Curator){ //If someone sends to curator.
            circulatingSupply_ -= _value;
        }
        emit Transfer(_from, _to, _value);
        return true;
    }

    //Used to store the total equivalent amount of application deposites prior approval.
    //Later tranfer to policy contract address after approval and creation.
    function updateDepoPool(uint256 _value, receiptTemplate memory _receipt) public onlyCurator{  //Only the Hushurance engine can create tellers.
        require(balances[Curator] >= _value);
        receipts[_receipt.transactionHash] = _receipt; //Store the BUSD payment receipt.
        
        //Compute the Hashurance equivalent of BUSD (value) sent.
        //Assuming 1HSHT = 1BUSD. NOTE this will not always be the case.
        initDepositesTotal += _value; //Adds to the pool of depositors funds.
        balances[Curator] -= _value;  //Deducts from curators funds.
        circulatingSupply_ += _value;
        emit Pendings(Curator, _value);
    }
}
