import { network } from "hardhat";

async function main() {
  console.log("Deploying LeaseCertificate contract...");

  const { ethers } = await network.connect();
  const LeaseCertificate = await ethers.getContractFactory(
    "LeaseCertificate"
  );

  const leaseCertificate = await LeaseCertificate.deploy();

  await leaseCertificate.waitForDeployment();

  const contractAddress = await leaseCertificate.getAddress();

  console.log("LeaseCertificate deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
