import { useEffect, useState } from "react";
import { AddProjectForm } from "./AddProjectForm";
import { AddVoterForm } from "./AddVoterForm";
import { ProjectsList } from "./ProjectsList";
import { VotersList } from "./VotersList";
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
    <div>
      <AddProjectForm
        newProject={newProject}
        handleProjectChange={handleProjectChange}
        handleProjectSubmit={handleProjectSubmit}
      />

      <AddVoterForm newVoter={newVoter} handleVoterChange={handleVoterChange} handleVoterSubmit={handleVoterSubmit} />

      <ProjectsList projects={(hackathonProjects as Project[]) || []} />
      <VotersList voters={(voterAddresses as string[]) || []} />
    </div>
  );
};
