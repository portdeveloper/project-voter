import { useEffect, useState } from "react";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";

type Project = { name: string; url: string };

export const AddVotersAndProjects = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
  const [newProject, setNewProject] = useState<Project>({ name: "", url: "" });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewProject({ name: "", url: "" });
  };

  const { write } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "addProjects",
    args: [[newProject.name], [newProject.url]],
  });

  console.log("Projects:", hackathonProjects);

  return (
    <div>
      <p>This is a page for adding voters and projects</p>
      <div>
        <form onSubmit={handleSubmit}>
          <input name="name" value={newProject.name} onChange={handleChange} placeholder="Project name" />
          <input name="url" value={newProject.url} onChange={handleChange} placeholder="Project URL" />
        </form>
        <button className="btn btn-primary" onClick={() => write?.()}>
          Submit Project
        </button>
      </div>
      <div>
        <h2>Your added projects:</h2>
        {hackathonProjects?.map((project: any, index) => (
          <div key={index}>
            <h3>{project.name}</h3>
            <p>{project.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
