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

  const handleSubmitData = (event: any) => {
    event.preventDefault(); // This will prevent the form submission from causing a page refresh

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
    setOwner("");
    setVotingPeriodInDays("");
    setHackathonName("");
  };

  const handleDeploy = () => {
    write?.();
  };

  return (
    <div className="p-4 rounded-md w-full">
      <form className="flex-col space-y-5 w-1/2">
        <input
          type="text"
          placeholder="Owner address"
          onChange={e => setOwner(e.target.value)}
          value={owner}
          className="form-input w-full rounded-md px-4 py-2 shadow-md"
        />
        <input
          type="number"
          placeholder="Voting period in days"
          onChange={e => setVotingPeriodInDays(e.target.value)}
          value={votingPeriodInDays}
          className="form-input w-full rounded-md px-4 py-2 shadow-md"
        />
        <input
          type="text"
          placeholder="Hackathon name"
          onChange={e => setHackathonName(e.target.value)}
          value={hackathonName}
          className="form-input w-full rounded-md px-4 py-2 shadow-md"
        />
        <button onClick={handleSubmitData} className="btn btn-primary">
          Prepare Data
        </button>
      </form>
      {preparedData && (
        <>
          <h3 className="text-lg font-bold my-3">Prepared Data:</h3>
          <div className="card shadow-md w-2/5">
            <div className="card-body bg-primary">
              <h2 className="card-title ">Hackathon Name: {preparedData.hackathonName}</h2>
              <p className="m-0 p-0">Voting Period: {preparedData.votingPeriodInDays} days</p>
              <p className="m-0 p-0">Owner: {preparedData.owner}</p>
              <div className="card-actions mt-2">
                <button onClick={handleEditPreparedData} className="btn btn-xs btn-secondary">
                  Edit
                </button>
                <button onClick={handleDeletePreparedData} className="btn btn-xs btn-error">
                  Delete
                </button>
              </div>
            </div>
          </div>
          <button onClick={handleDeploy} className="btn btn-primary mt-4">
            Deploy Contract
          </button>
        </>
      )}
      <div className="mt-5">{data && "HackathonVoter deployed! Tx hash: " + data.hash}</div>
    </div>
  );
};
