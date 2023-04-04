const aleo_address = "0x90D3d849c856713F21E824E943C7C83792c51381";
const Token_Artifact = require("../artifacts-zk/contracts/Token.sol/RewardToken.json");
const stakingHub_address = "0x99Dd8146271A66a49DB8A592A7C94BEeb3C42e06";
const StakingHubArtifact = require("../artifacts-zk/contracts/StakingHub.sol/StakingHub.json");
const { ethers } = require('ethers');


const overrides = {
  gasLimit: 15000000,
  gasPrice: 10 * 10 ** 9,
};

// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  ///Prepare deployer
  let privateKey = "0x433200fedb2386cd4fa915ce4c6777729534458339c29d110db4124997715fe3";
  let customHttpProvider = new ethers.providers.JsonRpcProvider(
    "https://testnet.era.zksync.dev"
  );
  const signer = new ethers.Wallet(privateKey, customHttpProvider);
  console.log(signer.address);

  ///deposit
  let token = new ethers.Contract(aleo_address, Token_Artifact.abi, signer);
  //999999989900
  console.log("approve...");
  // await token.approve(stakingHub_address, ethers.utils.parseUnits("100", 6), overrides);

  let StakingHub = new ethers.Contract(
    stakingHub_address,
    StakingHubArtifact.abi,
    signer
  );
  // let deposit = await StakingHub.deposit(
  //   ethers.utils.parseUnits("1", 6),
  //   signer.address,
  //   overrides
  // );
  // console.log("deposit:" + deposit.hash);

  // await new Promise((resolve, reject) => {
  //   setTimeout(function () {
  //     resolve('time')
  //   }, 3000)
  // })
  // let receipt = await customHttpProvider.getTransactionReceipt(deposit.hash);
  // console.log(receipt);

  ///reviewAssets
  let reviewAssets = await StakingHub.reviewAssets(signer.address);
  console.log("user's staking balance: " + reviewAssets);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
