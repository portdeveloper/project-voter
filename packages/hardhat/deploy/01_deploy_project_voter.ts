import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployProjectVoter: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("ProjectVoter", {
    from: deployer,
    log: true,
    args: ["0x3D8F33965A152F8Cad7A236485ED05ea288e0698", "1", "hackathon1"],
    autoMine: true,
  });
};

export default deployProjectVoter;

deployProjectVoter.tags = ["ProjectVoter"];
