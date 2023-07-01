import { useEffect, useState } from "react";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";

type Project = { name: string; url: string };

export const AddVotersAndProjects = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
  const [newProject, setNewProject] = useState<Project>({ name: "", url: "" });
  const [newVoter, setNewVoter] = useState<string>("");

  const { data: hackathonProjects, refetch: refetchProjects } = useContractRead({
    ...contractConfig,
    functionName: "getProjects",
  });

  useEffect(() => {
    refetchProjects();
  }, []);

  useContractEvent({
    ...contractConfig,
    eventName: "ProjectAdded",
    listener(name, url) {
      console.log(`Project added: name: ${name} - url: ${url}`);
      refetchProjects();
    },
  });

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
    listener(address) {
      console.log(`Voter added: address: ${address}`);
      refetchVoters();
    },
  });

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleVoterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewVoter(e.target.value);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProjects?.(); // Call addProjects function here
    setNewProject({ name: "", url: "" });
  };

  const handleVoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVoters?.(); // Call addVoters function here
    setNewVoter("");
  };

  const { write: addProjects } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "addProjects",
    args: [[newProject.name], [newProject.url]],
  });

  const { write: addVoters } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "addVoters",
    args: [[newVoter]],
  });

  return (
    <div className="mx-auto mt-10 w-full max-w-6xl">
      <div className="mb-4">
        <form onSubmit={handleProjectSubmit} className="mb-4 flex space-x-4">
          <input
            name="name"
            value={newProject.name}
            onChange={handleProjectChange}
            placeholder="Project name"
            className="form-input w-1/2 rounded-md px-4 py-2 shadow-md"
          />
          <input
            name="url"
            value={newProject.url}
            onChange={handleProjectChange}
            placeholder="Project URL"
            className="form-input w-1/2 rounded-md px-4 py-2 shadow-md"
          />
          <button className="btn btn-primary">Add Project</button>
        </form>
        <form onSubmit={handleVoterSubmit} className="mb-4 flex space-x-4">
          <input
            name="address"
            value={newVoter}
            onChange={handleVoterChange}
            placeholder="Address"
            className="form-input w-full rounded-md px-4 py-2 shadow-md"
          />
          <button className="btn btn-primary">Add Voter</button>
        </form>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-bold">Your added projects:</h2>
        <table className="table-zebra table w-full shadow-lg">
          <thead>
            <tr>
              <th className="bg-primary">Project Name</th>
              <th className="bg-primary">Project URL</th>
            </tr>
          </thead>
          <tbody>
            {hackathonProjects?.map((project: any, index) => (
              <tr key={index}>
                <td>{project.name}</td>
                <td>{project.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="mb-2 text-lg font-bold">Your added voters:</h2>
        <table className="table-zebra table w-full shadow-lg">
          <thead>
            <tr>
              <th className="bg-primary">Voter Address</th>
            </tr>
          </thead>
          <tbody>
            {voterAddresses &&
              (voterAddresses as string[]).map((address: string, index) => (
                <tr key={index}>
                  <td>{address}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
