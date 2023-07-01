import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployProjectVoter: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ProjectVoter", {
    from: deployer,
    log: true,
    args: ["0xd73309cCe5DaEe457CA9BEb63EdA39D3c5dF036F", "1", "hackathon1"],
    autoMine: true,
  });
};

export default deployProjectVoter;

deployProjectVoter.tags = ["ProjectVoter"];
