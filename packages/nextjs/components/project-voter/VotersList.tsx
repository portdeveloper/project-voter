interface VotersListProps {
  voters: string[];
}

export const VotersList = ({ voters }: VotersListProps) => (
  <div className="rounded-md shadow-sm bg-secondary">
    <h2 className="mb-2 text-xl text-primary-content">Your added voters:</h2>
    {voters.length > 0 ? (
      <table className="table table-zebra mt-4 w-full">
        <thead>
          <tr>
            <th className="text-left text-sm font-medium text-primary-content pb-2">Voter Address</th>
          </tr>
        </thead>
        <tbody>
          {voters.map((address: string, index) => (
            <tr key={index}>
              <td className="py-2 text-sm text-primary-content">{address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No voters in the smart contract.</p>
    )}
  </div>
);
