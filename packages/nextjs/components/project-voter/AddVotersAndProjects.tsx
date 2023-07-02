import { useEffect, useState } from "react";
import { AddProjectForm } from "./AddProjectForm";
import { AddVoterForm } from "./AddVoterForm";
import { ProjectsList } from "./ProjectsList";
import { VotersList } from "./VotersList";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";

type Project = { name: string; url: string };

export const AddVotersAndProjects = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
  const [newProject, setNewProject] = useState<Project>({ name: "", url: "" });
  const [newProjects, setNewProjects] = useState<Project[]>([]);
  const [newVoter, setNewVoter] = useState<string>("");
  const [newVoters, setNewVoters] = useState<string[]>([]);
  const [editingProject, setEditingProject] = useState<number | null>(null);
  const [editingVoter, setEditingVoter] = useState<number | null>(null);

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

    // Prevent submitting empty name or url
    if (!newProject.name.trim() || !newProject.url.trim()) {
      alert("Both name and url are required!");
      return;
    }

    // Prevent duplicate project entries
    if (newProjects.some(project => project.name === newProject.name && project.url === newProject.url)) {
      alert("Project is already added!");
      return;
    }

    if (editingProject !== null) {
      setNewProjects(newProjects.map((project, i) => (i === editingProject ? newProject : project)));
      setEditingProject(null);
    } else {
      setNewProjects([...newProjects, newProject]);
    }

    setNewProject({ name: "", url: "" });
  };

  const handleVoterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submitting empty address
    if (!newVoter.trim()) {
      alert("Address is required!");
      return;
    }

    // Prevent duplicate voter entries
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

  const handleProjectEdit = (index: number) => {
    setNewProject(newProjects[index]);
    setEditingProject(index);
  };

  const handleProjectDelete = (index: number) => {
    setNewProjects(newProjects.filter((_, i) => i !== index));
  };

  const handleVoterEdit = (index: number) => {
    setNewVoter(newVoters[index]);
    setEditingVoter(index);
  };

  const handleVoterDelete = (index: number) => {
    setNewVoters(newVoters.filter((_, i) => i !== index));
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
          <table className="table-auto table-zebra table w-full mt-2 text-primary-content">
            <thead>
              <tr>
                <th>Name</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {newProjects.length === 0 ? (
                <tr>
                  <td colSpan={3}>No projects added yet.</td>
                </tr>
              ) : (
                newProjects.map((project, i) => (
                  <tr key={i}>
                    <td>{project.name}</td>
                    <td>{project.url}</td>
                    <td className="flex items-center space-x-2">
                      <button className="btn btn-xs btn-outline btn-primary" onClick={() => handleProjectEdit(i)}>
                        Edit
                      </button>
                      <button className="btn btn-xs btn-outline btn-error" onClick={() => handleProjectDelete(i)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
