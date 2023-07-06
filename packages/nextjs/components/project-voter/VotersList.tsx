interface VotersListProps {
  voters: string[];
}

export const VotersList = ({ voters }: VotersListProps) => (
  <div className="rounded-md bg-secondary shadow-sm">
    <h2 className="mb-2 text-xl text-primary-content">Your added voters:</h2>
    {voters.length > 0 ? (
      <table className="table-zebra mt-4 table w-full">
        <thead>
          <tr>
            <th className="pb-2 text-left text-sm font-medium text-primary-content">Voter Address</th>
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
