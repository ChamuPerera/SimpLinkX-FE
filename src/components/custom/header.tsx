import type { FC } from "react";

import { Brand } from "@/components/custom/brand";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-blue-100 flex justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Brand />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-x-8">
            <NavButtons />
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex gap-x-4 items-center">
            <AuthButtons />
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-y-4">
              <NavButtons />
              <div className="flex flex-col gap-y-2 pt-4 border-t border-gray-200">
                <AuthButtons />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

const NavButtons: FC = () => {
  return (
    <>
      <a
        href="/#services"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 "
      >
        Services
      </a>
      <Link
        to="/find-hospitals"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 "
      >
        Hospitals
      </Link>
      <Link
        to="/osusala"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 "
      >
        Rajya Osusala Outlets
      </Link>
      <Link
        to="/about"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 "
      >
        About
      </Link>
      <Link
        to="/ncd-risk"
        className="text-sm font-medium text-gray-700 hover:text-blue-600 "
      >
        NCD Risk
      </Link>
    </>
  );
};

const AuthButtons: FC = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <Link
        to={"/dashboard"}
        className="text-white h-10 w-10 text-2xl flex justify-center items-center rounded-full hover:bg-blue-700 font-medium transition-colors bg-blue-600"
      >
        {user.name.charAt(0).toUpperCase()}
      </Link>
    );
  }

  return (
    <>
      <Link
        to={"/login"}
        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        Sign In
      </Link>
      <Link
        to={"/register"}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors duration-200 transform"
      >
        Register
      </Link>
    </>
  );
};
