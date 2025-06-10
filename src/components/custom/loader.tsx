import type { FC } from "react";

export const Loader: FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <h1 className="relative z-10 animate-pulse text-center text-2xl font-medium text-blue-600 md:text-4xl">
        SimpLinkX
      </h1>
    </div>
  );
};
