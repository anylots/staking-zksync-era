import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre) {
  console.log(`Running deploy script for the AleoToken contract`);

  // Initialize the wallet.
  const wallet = new Wallet("");

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("RewardToken");

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, [ethers.BigNumber.from(10 ** 12).mul(ethers.BigNumber.from(10 ** 6))]);
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);


  // deploy RewardToken.
  const rewardToken = await deployer.deploy(artifact, [ethers.BigNumber.from(10 ** 12).mul(ethers.BigNumber.from(10 ** 6))]);
  const contractAddress = rewardToken.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  // deploy StakingHub.
  const StakingHub_Artifact = await deployer.loadArtifact("StakingHub");
  const stakingHub = await deployer.deploy(StakingHub_Artifact, [rewardToken.address, rewardToken.address, 500]);
  const stakingHub_address = stakingHub.address;
  console.log(`${StakingHub_Artifact.contractName} was deployed to ${stakingHub_address}`);


  ///prepare fund of StakingHub
  await rewardToken.approve(stakingHub.address, 100 * 10 ** 6);
  await stakingHub.prepareRewardVault(100 * 10 ** 6);
  console.log("await..........");

  await new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve('time')
    }, 3000)
  })

  let reviewRewardVault = await stakingHub.reviewRewardVault();
  console.log("reviewRewardVault:" + reviewRewardVault);

}
