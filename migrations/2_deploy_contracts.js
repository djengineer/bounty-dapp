var Bounty = artifacts.require("Bounty");
var Adoption = artifacts.require("Adoption");

module.exports = function(deployer) {
  deployer.deploy(Bounty);
  deployer.deploy(Adoption);
};