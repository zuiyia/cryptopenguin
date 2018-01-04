var PenguinFactory = artifacts.require("./PenguinFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(PenguinFactory);
};
