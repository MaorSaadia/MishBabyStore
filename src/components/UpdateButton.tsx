"use client";

import { useFormStatus } from "react-dom";

const UpdateButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="bg-cyan-500 text-white p-2 rounded-md cursor-pointer hover:bg-cyan-600 disabled:bg-cyan-200 disabled:cursor-not-allowed max-w-96"
    >
      {pending ? "Updating..." : "Update"}
    </button>
  );
};

export default UpdateButton;
