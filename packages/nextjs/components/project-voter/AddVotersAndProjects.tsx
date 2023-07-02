import { useEffect, useState } from "react";
import { AddProjectForm } from "./AddProjectForm";
import { AddVoterForm } from "./AddVoterForm";
import { ProjectsList } from "./ProjectsList";
import { VotersList } from "./VotersList";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";

type Project = { name: string; url: string };

export const AddVotersAndProjects = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
  const [newProject, setNewProject] = useState<Project>({ name: "", url: "" });
  const [newProjects, setNewProjects] = useState<Project[]>([]); // NEW
  const [newVoter, setNewVoter] = useState<string>("");
  const [newVoters, setNewVoters] = useState<string[]>([]); // NEW

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
    setNewProjects([...newProjects, newProject]); // Add new project to list
    setNewProject({ name: "", url: "" });
  };

  const handleVoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewVoters([...newVoters, newVoter]); // Add new voter to list
    setNewVoter("");
  };

  const handleWriteProjects = () => {
    addProjects?.(); // Call addProjects function here
    setNewProjects([]); // Clear new projects
  };

  const handleWriteVoters = () => {
    addVoters?.(); // Call addVoters function here
    setNewVoters([]); // Clear new voters
  };

  const { write: addProjects } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "addProjects",
    args: [newProjects.map(p => p.name), newProjects.map(p => p.url)], // Use newProjects for args
  });

  const { write: addVoters } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "addVoters",
    args: [newVoters], // Use newVoters for args
  });

  return (
    <div className="m-10 w-full max-w-6xl flex">
      <div className="mb-4 flex-grow">
        <div className="p-6 rounded-md shadow-sm bg-secondary">
          <AddProjectForm
            newProject={newProject}
            handleProjectChange={handleProjectChange}
            handleProjectSubmit={handleProjectSubmit}
          />

          <div className="mt-4 text-xl text-primary-content">New Projects:</div>
          <ul className="list-disc list-inside mt-2 text-primary-content">
            {newProjects.map((project, i) => (
              <li key={i} className="ml-5">
                {project.name} - {project.url}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary mt-4" onClick={handleWriteProjects} disabled={newProjects.length === 0}>
            Write Projects to the Contract
          </button>
        </div>
        <div className="p-6 rounded-md shadow-sm bg-secondary mt-6">
          <AddVoterForm
            newVoter={newVoter}
            handleVoterChange={handleVoterChange}
            handleVoterSubmit={handleVoterSubmit}
          />

          <div className="mt-4 text-xl text-secondary-content">New Voters:</div>
          <ul className="list-disc list-inside mt-2 text-secondary-content">
            {newVoters.map((address, i) => (
              <li key={i} className="ml-5">
                {address}
              </li>
            ))}
          </ul>
          <button className="btn btn-primary mt-4" onClick={handleWriteVoters} disabled={newVoters.length === 0}>
            Write Voters to the Contract
          </button>
        </div>
      </div>
      <div className="ml-10 flex-grow">
        <div>
          <ProjectsList projects={(hackathonProjects as Project[]) || []} />
        </div>
        <div className="mt-8">
          <VotersList voters={(voterAddresses as string[]) || []} />
        </div>
      </div>
    </div>
  );
};
