interface VotersListProps {
  voters: string[];
}

export const VotersList = ({ voters }: VotersListProps) => (
  <div>
    <h2 className="mb-2 text-lg font-bold">Your added voters:</h2>
    <table className="table-zebra table w-full shadow-lg">
      <thead>
        <tr>
          <th className="bg-primary">Voter Address</th>
        </tr>
      </thead>
      <tbody>
        {voters &&
          (voters as string[]).map((address: string, index) => (
            <tr key={index}>
              <td>{address}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
