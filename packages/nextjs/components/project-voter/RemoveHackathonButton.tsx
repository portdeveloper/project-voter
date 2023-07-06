import { useContractWrite } from "wagmi";
import { getParsedError } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const RemoveHackathonButton = ({ index, contractConfig }: { index: number; contractConfig: any }) => {
  const { write } = useContractWrite({
    ...contractConfig,
    functionName: "removeHackathon",
    args: [BigInt(index)],
    onError: (error: Error) => {
      const simplifiedMessage = getParsedError(error);
      notification.error(simplifiedMessage);
    },
  });

  return (
    <button
      onClick={() => {
        write?.();
      }}
      className="btn btn-sm btn-error"
    >
      Remove Hackathon
    </button>
  );
};
