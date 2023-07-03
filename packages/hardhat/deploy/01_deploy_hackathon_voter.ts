import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployHackathonVoter: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("HackathonVoter", {
    from: deployer,
    log: true,
    args: ["0x3D8F33965A152F8Cad7A236485ED05ea288e0698", "1", "hackathon1"],
    autoMine: true,
  });
};

export default deployHackathonVoter;

deployHackathonVoter.tags = ["HackathonVoter"];
