interface ProjectsListProps {
  projects: { name: string; url: string }[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => (
  <div className="rounded-md bg-secondary shadow-sm">
    <h2 className="mb-2 text-xl text-primary-content">Your added projects:</h2>
    <table className="table-zebra mt-4 table w-full table-auto">
      <thead>
        <tr>
          <th className="pb-2 text-left font-medium text-primary-content">Name</th>
          <th className="pb-2 text-left font-medium text-primary-content">URL</th>
        </tr>
      </thead>
      <tbody>
        {projects.length === 0 ? (
          <tr>
            <td colSpan={3}>No projects added yet.</td>
          </tr>
        ) : (
          projects.map((project: any, index) => (
            <tr key={index}>
              <td className="py-2 text-primary-content">{project.name}</td>
              <td className="py-2 text-primary-content">
                <a href={project.url} target="_blank" rel="noreferrer" className="underline">
                  {project.url}
                </a>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
