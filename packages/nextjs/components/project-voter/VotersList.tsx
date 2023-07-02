interface VotersListProps {
  voters: string[];
}

export const VotersList = ({ voters }: VotersListProps) => (
  <div className="p-6 rounded-md shadow-sm bg-secondary">
    <h2 className="mb-2 text-xl text-primary-content">Your added voters:</h2>
    <table className="table table-zebra mt-4 w-full">
      <thead>
        <tr>
          <th className="text-left text-sm font-medium text-primary-content pb-2">Voter Address</th>
        </tr>
      </thead>
      <tbody>
        {voters &&
          (voters as string[]).map((address: string, index) => (
            <tr key={index}>
              <td className="py-2 text-sm text-primary-content">{address}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
