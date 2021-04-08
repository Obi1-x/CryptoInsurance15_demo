/* const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function (deployer) {
  // below is use since there is no constructor in the contract
  deployer.deploy(SimpleStorage);

  // below is use if there is constructor in the contract e.g in helloworld
  deployer.deploy(SimpleStorage, 'Alabi');
}; */

const Hashsurance = artifacts.require("Hashsurance");

module.exports = function (deployer) {
    deployer.deploy(Hashsurance, 'Alabi');
};

