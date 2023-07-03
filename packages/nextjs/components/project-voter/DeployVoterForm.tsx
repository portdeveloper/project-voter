import { useState } from "react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

interface DeployVoterFormProps {
  PVFAddress: string;
  PVFAbi: any[]; // replace with abi type ?
}

export const DeployVoterForm = ({ PVFAddress, PVFAbi }: DeployVoterFormProps) => {
  const [owner, setOwner] = useState("");
  const [votingPeriodInDays, setVotingPeriodInDays] = useState(0);
  const [hackathonName, setHackathonName] = useState("");

  const { config } = usePrepareContractWrite({
    address: PVFAddress,
    abi: PVFAbi,
    functionName: "createProjectVoter",
    args: [owner, ethers.BigNumber.from(votingPeriodInDays), hackathonName],
  });

  const { write, data } = useContractWrite(config);

  return (
    <div className="flex justify-center mx-auto">
      <div className="mx-auto mt-10 w-full max-w-6xl space-y-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <input
            type="text"
            placeholder="Owner address"
            onChange={e => setOwner(e.target.value)}
            className="input w-full mb-4 shadow-md"
          />
          <input
            type="number"
            placeholder="Voting period in days"
            onChange={e => setVotingPeriodInDays(parseInt(e.target.value))}
            className="input w-full mb-4 shadow-md"
          />
          <input
            type="text"
            placeholder="Hackathon name"
            onChange={e => setHackathonName(e.target.value)}
            className="input w-full mb-4 shadow-md"
          />
          <button onClick={() => write?.()} className="btn btn-primary w-full">
            Deploy
          </button>
        </div>
        <div>ProjectVoter deployed! Tx hash: {data?.hash}</div>
      </div>
    </div>
  );
};
