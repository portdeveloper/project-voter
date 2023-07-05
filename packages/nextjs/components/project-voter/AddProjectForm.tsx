type Project = { name: string; url: string };

interface AddProjectFormProps {
  newProject: Project;
  handleProjectChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProjectSubmit: (e: React.FormEvent) => void;
}

export const AddProjectForm = ({ newProject, handleProjectChange, handleProjectSubmit }: AddProjectFormProps) => (
  <form onSubmit={handleProjectSubmit} className="mb-4 flex space-x-4">
    <input
      name="name"
      value={newProject.name}
      onChange={handleProjectChange}
      placeholder="Project name"
      className="form-input w-1/2 rounded-md px-4 py-2 shadow-md bg-base-100"
    />
    <input
      name="url"
      value={newProject.url}
      onChange={handleProjectChange}
      placeholder="Project URL"
      className="form-input w-1/2 rounded-md px-4 py-2 shadow-md bg-base-100"
    />
    <button className="btn btn-primary">Add Project</button>
  </form>
);
