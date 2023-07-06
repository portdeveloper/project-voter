import { useContractWrite } from "wagmi";
import { getParsedError } from "~~/components/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const RemoveProjectButton = ({ index, contractConfig }: { index: number; contractConfig: any }) => {
  const { write } = useContractWrite({
    ...contractConfig,
    functionName: "removeProject",
    args: [BigInt(index)],
    onError: (error: Error) => {
      const simplifiedMessage = getParsedError(error);
      notification.error(simplifiedMessage);
    },
  });

  const handleRemove = () => {
    if (window.confirm("Are you sure you want to remove this project?")) {
      write?.();
    }
  };

  return (
    <button onClick={handleRemove} className="btn btn-sm btn-error">
      Remove Project
    </button>
  );
};
