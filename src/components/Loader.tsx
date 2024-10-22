import React from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps {
  color?: string;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({
  color = "text-cyan-600",
  text = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${color}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
};

export default Loader;
