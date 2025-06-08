import { Link } from "react-router";

export const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold md:text-7xl">404</h1>
      <p className="mt-4 text-lg">Page Not Found</p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 font-medium text-white shadow-md transition hover:bg-blue-700"
      >
        Go to Home
      </Link>
    </div>
  );
};
