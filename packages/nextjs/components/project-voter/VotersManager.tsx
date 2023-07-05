import { useEffect, useState } from "react";
import { AddVoterForm } from "./AddVoterForm";
import { VotersList } from "./VotersList";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { getParsedError } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const VotersManager = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
  const [newVoter, setNewVoter] = useState<string>("");
  const [newVoters, setNewVoters] = useState<string[]>([]);
  const [editingVoter, setEditingVoter] = useState<number | null>(null);

  const { data: voterAddresses, refetch: refetchVoters } = useContractRead({
    ...contractConfig,
    functionName: "getVoters",
  });

  useEffect(() => {
    refetchVoters();
  }, []);

  useContractEvent({
    ...contractConfig,
    eventName: "VoterAdded",
    listener(log: any) {
      console.log(log);
      refetchVoters();
    },
  });

  const handleVoterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVoter(e.target.value);
  };

  const handleVoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newVoter.trim()) {
      alert("Address is required!");
      return;
    }

    if (newVoters.includes(newVoter)) {
      alert("Voter is already added!");
      return;
    }

    if (editingVoter !== null) {
      setNewVoters(newVoters.map((voter, i) => (i === editingVoter ? newVoter : voter)));
      setEditingVoter(null);
    } else {
      setNewVoters([...newVoters, newVoter]);
    }

    setNewVoter("");
  };

  const handleVoterEdit = (index: number) => {
    setNewVoter(newVoters[index]);
    setEditingVoter(index);
  };

  const handleVoterDelete = (index: number) => {
    setNewVoters(newVoters.filter((_, i) => i !== index));
  };

  const handleWriteVoters = () => {
    addVoters?.();
    setNewVoters([]);
  };

  const { write: addVoters } = useContractWrite({
    ...contractConfig,
    functionName: "addVoters",
    args: [newVoters],
    onError: (error: Error) => {
      const simplifiedMessage = getParsedError(error.message);
      notification.error(simplifiedMessage);
    },
  });

  return (
    <div className="p-6 rounded-md shadow-sm bg-secondary w-full">
      <AddVoterForm newVoter={newVoter} handleVoterChange={handleVoterChange} handleVoterSubmit={handleVoterSubmit} />
      <div className="mt-4 text-xl text-secondary-content">New Voters:</div>
      <table className="table-auto table-zebra table w-full mt-2 text-secondary-content">
        <thead>
          <tr>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newVoters.length === 0 ? (
            <tr>
              <td colSpan={2}>No voters added yet.</td>
            </tr>
          ) : (
            newVoters.map((address, i) => (
              <tr key={i}>
                <td>{address}</td>
                <td className="flex items-center space-x-2">
                  <button className="btn btn-xs btn-outline btn-primary" onClick={() => handleVoterEdit(i)}>
                    Edit
                  </button>
                  <button className="btn btn-xs btn-outline btn-error" onClick={() => handleVoterDelete(i)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button className="btn btn-primary mt-4" onClick={handleWriteVoters} disabled={newVoters.length === 0}>
        Write Voters to the Contract
      </button>
      <hr className="my-4 border-t-2 border-gray-300" />
      <VotersList voters={(voterAddresses as string[]) || []} />
    </div>
  );
};
