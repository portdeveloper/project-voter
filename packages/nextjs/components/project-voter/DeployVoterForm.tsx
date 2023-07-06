import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import { getParsedError } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface DeployVoterFormProps {
  HVFAddress: string;
  HVFAbi: any[];
}

// @todo Does not check the existance of the contract!

export const DeployVoterForm = ({ HVFAddress, HVFAbi }: DeployVoterFormProps) => {
  const [owner, setOwner] = useState("");
  const [startTime, setStartTime] = useState(Math.floor(Date.now() / 1000));
  const [endTime, setEndTime] = useState(Math.floor((Date.now() + 7 * 24 * 60 * 60 * 1000) / 1000));

  const [hackathonName, setHackathonName] = useState("");

  const [preparedData, setPreparedData] = useState<{
    owner: string;
    startTime: number;
    endTime: number;
    hackathonName: string;
  } | null>(null);

  const { write, data } = useContractWrite({
    address: HVFAddress,
    abi: HVFAbi,
    functionName: "createHackathonVoter",
    args: preparedData
      ? [preparedData.owner, BigInt(preparedData.startTime), BigInt(preparedData.endTime), preparedData.hackathonName]
      : [],
    onError: (error: Error) => {
      const simplifiedMessage = getParsedError(error);
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

    if (owner && hackathonName) {
      setPreparedData({
        owner,
        startTime: Number(startTime),
        endTime: Number(endTime),
        hackathonName,
      });
    } else {
      alert("Please fill all fields correctly");
    }
  };

  const handleEditPreparedData = () => {
    if (preparedData) {
      setOwner(preparedData.owner);
      setStartTime(preparedData.startTime);
      setEndTime(preparedData.endTime);
      setHackathonName(preparedData.hackathonName);
      setPreparedData(null);
    }
  };

  const handleDeletePreparedData = () => {
    setPreparedData(null);
    setOwner("");
    setStartTime(0);
    setEndTime(0);
    setHackathonName("");
  };

  const handleDeploy = () => {
    write?.();
  };

  return (
    <div className="w-full rounded-md p-4">
      <form className="w-1/2 flex-col space-y-5">
        <input
          type="text"
          placeholder="Owner address"
          onChange={e => setOwner(e.target.value)}
          value={owner}
          className="form-input w-full rounded-md bg-primary px-4 py-2 shadow-md"
        />
        <input
          type="datetime-local"
          placeholder="Start time"
          onChange={e => setStartTime(new Date(e.target.value).getTime() / 1000)}
          value={new Date(startTime * 1000).toISOString().substring(0, 16)}
          className="form-input w-full rounded-md bg-primary px-4 py-2 shadow-md"
        />
        <input
          type="datetime-local"
          placeholder="End time"
          onChange={e => setEndTime(new Date(e.target.value).getTime() / 1000)}
          value={new Date(endTime * 1000).toISOString().substring(0, 16)}
          className="form-input w-full rounded-md bg-primary px-4 py-2 shadow-md"
        />

        <input
          type="text"
          placeholder="Hackathon name"
          onChange={e => setHackathonName(e.target.value)}
          value={hackathonName}
          className="form-input w-full rounded-md bg-primary px-4 py-2 shadow-md"
        />
        <button onClick={handleSubmitData} className="btn btn-primary">
          Prepare Data
        </button>
      </form>
      {preparedData && (
        <>
          <h3 className="my-3 text-lg font-bold">Prepared Data:</h3>
          <div className="card w-2/5 shadow-md">
            <div className="card-body bg-primary">
              <h2 className="card-title ">Hackathon Name: {preparedData.hackathonName}</h2>
              <p className="m-0 p-0">
                Start time:{" "}
                {new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(
                  new Date(preparedData.startTime * 1000),
                )}
              </p>
              <p className="m-0 p-0">
                End time:{" "}
                {new Intl.DateTimeFormat("en-US", { dateStyle: "full", timeStyle: "short" }).format(
                  new Date(preparedData.endTime * 1000),
                )}
              </p>
              <p className="m-0 p-0">Owner: {preparedData.owner}</p>
              <div className="card-actions mt-2">
                <button onClick={handleEditPreparedData} className="btn btn-secondary btn-xs">
                  Edit
                </button>
                <button onClick={handleDeletePreparedData} className="btn btn-error btn-xs">
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

      <div className="mt-5">
        <div>
          {data && (
            <>
              <div>HackathonVoter deployed! Tx hash: {data.hash}</div>
              <a
                href={`https://etherscan.io/tx/${data.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on Etherscan
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
