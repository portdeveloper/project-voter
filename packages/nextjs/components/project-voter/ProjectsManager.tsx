import { useEffect, useState } from "react";
import { AddProjectForm } from "./AddProjectForm";
import { ProjectsList } from "./ProjectsList";
import { useContractEvent, useContractRead, useContractWrite } from "wagmi";
import { getParsedError } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

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
    listener(log: any) {
      console.log(log);
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
    functionName: "addProjects",
    args: [newProjects.map(p => p.name), newProjects.map(p => p.url)],
    onError: (error: Error) => {
      const simplifiedMessage = getParsedError(error);
      notification.error(simplifiedMessage);
    },
  });

  return (
    <div className="w-full rounded-md bg-secondary p-6 shadow-sm">
      <AddProjectForm
        newProject={newProject}
        handleProjectChange={handleProjectChange}
        handleProjectSubmit={handleProjectSubmit}
      />
      <div className="mt-4 text-xl text-primary-content">New Projects:</div>
      <div className="overflow-auto">
        <table className="table-zebra mt-2 table w-full table-auto text-primary-content">
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
                    <button className="btn btn-primary btn-xs" onClick={() => handleProjectEdit(i)}>
                      Edit
                    </button>
                    <button className="btn btn-error btn-xs" onClick={() => handleProjectDelete(i)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary mt-4" onClick={handleWriteProjects} disabled={newProjects.length === 0}>
        Write Projects to the Contract
      </button>
      <hr className="my-4 border-t-2 border-gray-300" />
      <ProjectsList projects={(hackathonProjects as Project[]) || []} />
    </div>
  );
};
