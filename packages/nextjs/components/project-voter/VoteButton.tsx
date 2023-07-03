import { ethers } from "ethers";
import { useContractWrite } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

export const VoteButton = ({ index, contractConfig }: { index: number; contractConfig: any }) => {
  const { write } = useContractWrite({
    ...contractConfig,
    functionName: "vote",
    mode: "recklesslyUnprepared",
    args: [ethers.BigNumber.from(index)],
    onError: error => {
      const simplifiedMessage = simplifyErrorMessage(error.message);
      notification.error(simplifiedMessage);
    },
  });

  return (
    <button
      onClick={() => {
        write?.();
      }}
      className="btn btn-primary"
    >
      Vote
    </button>
  );
};

// try to find the error string in the message and return it while keeping it readable
// perhaps we can make this into a utils func and use switch case inside
function simplifyErrorMessage(message: string): string {
  const startPhrase = "reverted with reason string '";
  const start = message.indexOf(startPhrase);
  if (start !== -1) {
    const end = message.indexOf("'", start + startPhrase.length);
    if (end !== -1) return message.slice(start + startPhrase.length, end); // Return only the reason string
  }

  const lowBalancePhrase = "sender doesn't have enough funds to send tx";
  if (message.includes(lowBalancePhrase)) {
    return "You don't have enough funds to perform this transaction.";
  }

  const alreadyVotedPhrase = "reverted with custom error 'AlreadyVoted()'";
  if (message.includes(alreadyVotedPhrase)) {
    return "You have already voted!";
  }

  return message; // If we can't simplify the error message, return the original message
}
