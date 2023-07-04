import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import { getParsedWagmiError } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface DeployVoterFormProps {
  HVFAddress: string;
  HVFAbi: any[];
}

export const DeployVoterForm = ({ HVFAddress, HVFAbi }: DeployVoterFormProps) => {
  const [owner, setOwner] = useState("");
  const [votingPeriodInDays, setVotingPeriodInDays] = useState("");
  const [hackathonName, setHackathonName] = useState("");

  const [preparedData, setPreparedData] = useState<{
    owner: string;
    votingPeriodInDays: number;
    hackathonName: string;
  } | null>(null);

  const { write, data } = useContractWrite({
    address: HVFAddress,
    abi: HVFAbi,
    functionName: "createHackathonVoter",
    args: preparedData
      ? [preparedData.owner, ethers.BigNumber.from(preparedData.votingPeriodInDays), preparedData.hackathonName]
      : [],
    mode: "recklesslyUnprepared",
    onError: error => {
      const simplifiedMessage = getParsedWagmiError(error.message);
      notification.error(simplifiedMessage);
    },
  });

  useEffect(() => {
    if (data) {
      setPreparedData(null); // reset preparedData after successful contract deployment
    }
  }, [data]);

  const handleSubmitData = () => {
    if (owner && votingPeriodInDays.trim() !== "" && hackathonName) {
      setPreparedData({ owner, votingPeriodInDays: Number(votingPeriodInDays), hackathonName });
    } else {
      alert("Please fill all fields correctly");
    }
  };

  const handleEditPreparedData = () => {
    if (preparedData) {
      setOwner(preparedData.owner);
      setVotingPeriodInDays(String(preparedData.votingPeriodInDays));
      setHackathonName(preparedData.hackathonName);
      setPreparedData(null);
    }
  };

  const handleDeletePreparedData = () => {
    setPreparedData(null);
    // clear the input fields
    setOwner("");
    setVotingPeriodInDays("");
    setHackathonName("");
  };

  const handleDeploy = () => {
    write?.();
  };

  return (
    <div className="p-6 rounded-md shadow-sm bg-secondary w-full">
      <input
        type="text"
        placeholder="Owner address"
        onChange={e => setOwner(e.target.value)}
        value={owner}
        className="input w-full mb-4 shadow-md"
      />
      <input
        type="number"
        placeholder="Voting period in days"
        onChange={e => setVotingPeriodInDays(e.target.value)}
        value={votingPeriodInDays}
        className="input w-full mb-4 shadow-md"
      />
      <input
        type="text"
        placeholder="Hackathon name"
        onChange={e => setHackathonName(e.target.value)}
        value={hackathonName}
        className="input w-full mb-4 shadow-md"
      />
      <button onClick={handleSubmitData} className="btn btn-primary w-full">
        Prepare Data
      </button>
      {preparedData && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2 text-primary-content">Prepared Data:</h3>
          <p>Owner: {preparedData.owner}</p>
          <p>Voting Period: {preparedData.votingPeriodInDays} days</p>
          <p>Hackathon Name: {preparedData.hackathonName}</p>
          <div className="flex items-center space-x-2 mt-2">
            <button onClick={handleEditPreparedData} className="btn btn-xs btn-outline btn-primary">
              Edit
            </button>
            <button onClick={handleDeletePreparedData} className="btn btn-xs btn-outline btn-error">
              Delete
            </button>
          </div>
          <button onClick={handleDeploy} className="btn btn-primary w-full mt-4">
            Deploy Contract
          </button>
        </div>
      )}
      <hr className="my-4 border-t-2 border-gray-300" />
      <div>{data && "HackathonVoter deployed! Tx hash: " + data.hash}</div>
    </div>
  );
};
