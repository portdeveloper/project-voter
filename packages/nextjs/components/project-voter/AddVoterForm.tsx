interface AddVoterFormProps {
  newVoter: string;
  handleVoterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVoterSubmit: (e: React.FormEvent) => void;
}

export const AddVoterForm = ({ newVoter, handleVoterChange, handleVoterSubmit }: AddVoterFormProps) => (
  <form onSubmit={handleVoterSubmit} className="mb-4 flex space-x-4">
    <input
      name="address"
      value={newVoter}
      onChange={handleVoterChange}
      placeholder="Address"
      className="form-input w-full rounded-md px-4 py-2 shadow-md bg-base-100"
    />
    <button className="btn btn-primary">Add Voter</button>
  </form>
);
