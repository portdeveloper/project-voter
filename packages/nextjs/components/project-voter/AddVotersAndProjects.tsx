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

  return (
    <div className="mx-auto mt-10 w-full max-w-6xl">
      <div className="mb-4">
        <form onSubmit={handleSubmit} className="flex space-x-4 mb-4">
          <input
            name="name"
            value={newProject.name}
            onChange={handleChange}
            placeholder="Project name"
            className="form-input px-4 py-2 w-1/2 shadow-md rounded-md"
          />
          <input
            name="url"
            value={newProject.url}
            onChange={handleChange}
            placeholder="Project URL"
            className="form-input px-4 py-2 w-1/2 shadow-md rounded-md"
          />
          <button className="btn btn-primary" onClick={() => write?.()}>
            Submit Project
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Your added projects:</h2>
        <table className="table table-zebra w-full shadow-lg">
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
    </div>
  );
};
