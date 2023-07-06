interface ProjectsListProps {
  projects: { name: string; url: string }[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => (
  <div className="rounded-md bg-secondary shadow-sm">
    <h2 className="mb-2 text-xl text-primary-content">Your added projects:</h2>
    {projects.length > 0 ? (
      <table className="table-zebra mt-4 table w-full">
        <thead>
          <tr>
            <th className="pb-2 text-left text-sm font-medium text-primary-content">Project Name</th>
            <th className="pb-2 text-left text-sm font-medium text-primary-content">Project URL</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project: any, index) => (
            <tr key={index}>
              <td className="py-2 text-sm text-primary-content">{project.name}</td>
              <td className="py-2 text-sm text-primary-content">
                <a href={project.url} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                  {project.url}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No projects in the smart contract.</p>
    )}
  </div>
);
