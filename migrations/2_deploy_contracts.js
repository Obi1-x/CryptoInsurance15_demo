/* const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function (deployer) {
  // below is use since there is no constructor in the contract
  deployer.deploy(SimpleStorage);

  // below is use if there is constructor in the contract e.g in hashsurance
  deployer.deploy(SimpleStorage, 'Alabi');
}; */

const _Insurengine = artifacts.require("_Insurengine");

module.exports = function (deployer) {
  deployer.deploy(_Insurengine, '0xDf4D56b47C5d1223f5FAbB49089e8AF7De418C24');
};

