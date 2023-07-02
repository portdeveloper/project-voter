import { useEffect, useState } from "react";
import { AddProjectForm } from "./AddProjectForm";
import { ProjectsList } from "./ProjectsList";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";

type Project = { name: string; url: string };

export const ProjectsManager = ({ contractConfig }: { contractConfig: { address: string; abi: any } | null }) => {
  const [newProject, setNewProject] = useState<Project>({ name: "", url: "" });
  const [newProjects, setNewProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<number | null>(null);

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

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProject.name.trim() || !newProject.url.trim()) {
      alert("Both name and url are required!");
      return;
    }

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

  const handleProjectEdit = (index: number) => {
    setNewProject(newProjects[index]);
    setEditingProject(index);
  };

  const handleProjectDelete = (index: number) => {
    setNewProjects(newProjects.filter((_, i) => i !== index));
  };

  const handleWriteProjects = () => {
    addProjects?.();
    setNewProjects([]);
  };

  const { write: addProjects } = useContractWrite({
    ...contractConfig,
    mode: "recklesslyUnprepared",
    functionName: "addProjects",
    args: [newProjects.map(p => p.name), newProjects.map(p => p.url)], // Use newProjects for args
  });

  return (
    <div className="p-6 rounded-md shadow-sm bg-secondary w-full">
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
      <div>
        <ProjectsList projects={(hackathonProjects as Project[]) || []} />
      </div>
    </div>
  );
};
