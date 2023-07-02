interface ProjectsListProps {
  projects: { name: string; url: string }[];
}

export const ProjectsList = ({ projects }: ProjectsListProps) => (
  <div>
    <h2 className="mb-2 text-lg font-bold">Your added projects:</h2>
    <table className="table-zebra table w-full shadow-lg">
      <thead>
        <tr>
          <th className="bg-primary">Project Name</th>
          <th className="bg-primary">Project URL</th>
        </tr>
      </thead>
      <tbody>
        {projects?.map((project: any, index) => (
          <tr key={index}>
            <td>{project.name}</td>
            <td>{project.url}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
