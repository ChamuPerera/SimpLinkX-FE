import type { FC } from "react";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export const BackToTopButton: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 cursor-pointer right-6 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-opacity duration-300 hover:bg-blue-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
