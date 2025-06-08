import type { FC } from "react";

import { Heart } from "lucide-react";
import { Link } from "react-router";

export const Brand: FC = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
        <Heart className="h-6 w-6 text-white" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        SimpLinkX
      </span>
    </Link>
  );
};
