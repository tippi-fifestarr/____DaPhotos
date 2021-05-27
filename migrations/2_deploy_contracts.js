const DaPhotos = artifacts.require("DaPhotos");

module.exports = function(deployer) {
  deployer.deploy(DaPhotos);
};