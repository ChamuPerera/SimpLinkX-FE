import type { FC } from "react";

import { Link } from "react-router";

export const Brand: FC = () => {
  return (
    <Link to="/" className="flex items-center">
      <img src="/logo.png" alt="logo" className="h-10 w-10" />
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        SimpLinkX
      </span>
    </Link>
  );
};
