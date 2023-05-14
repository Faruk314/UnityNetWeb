import React from "react";

interface Props {
  message: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Confirmation = ({ message, setOpen }: Props) => {
  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 left-0 right-0 bg-[rgb(0,0,0,0.5)] z-20">
      <div className="bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-md w-max p-5 flex flex-col items-center">
        <p>{message}</p>
        <button
          onClick={() => setOpen(false)}
          className="p-2 mt-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
