interface VotersListProps {
  voters: string[];
}

export const VotersList = ({ voters }: VotersListProps) => (
  <div className="rounded-md bg-secondary shadow-sm">
    <h2 className="mb-2 text-xl text-primary-content">Your added voters:</h2>
    <table className="table-zebra mt-4 table w-full">
      <thead>
        <tr>
          <th className="pb-2 text-left font-medium text-primary-content">Voter Address</th>
        </tr>
      </thead>
      <tbody>
        {voters.length === 0 ? (
          <tr>
            <td colSpan={3}>No voters added yet.</td>
          </tr>
        ) : (
          voters.map((address: string, index) => (
            <tr key={index}>
              <td className="py-2 text-primary-content">{address}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
