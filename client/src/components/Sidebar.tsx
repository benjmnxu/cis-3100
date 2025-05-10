import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`
        ${expanded ? "w-50 bg-gray-800" : "w-10 bg-transparent"}
        h-full text-white transition-all duration-300 ease-in-out
        flex flex-col items-center
      `}
    >
      <div className="w-full flex justify-end px-2 py-8 mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`text-${expanded ? "white" : "black"} !text-4xl absolute right-0 top-0`}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
      </div>

      {expanded && (
        <>
            <nav className="w-full px-4 mt-4 text-left">
            <ul className="space-y-2">
                <li>
                <Link to="/" className="block px-2 py-2 hover:bg-gray-700 rounded">
                    Home
                </Link>
                </li>
                <li>
                <Link to="/search" className="block px-2 py-2 hover:bg-gray-700 rounded">
                    Search Recipes
                </Link>
                </li>
                <li>
                <Link to="/upload-recipe" className="block px-2 py-2 hover:bg-gray-700 rounded">
                    Upload Recipe
                </Link>
                </li>
                {/* <li>
                <Link to="/categories" className="block px-2 py-2 hover:bg-gray-700 rounded">
                    Categories
                </Link>
                </li> */}
            </ul>
            </nav>
            <div className="mt-auto p-4 border-t border-gray-700">
            <Link
                to="/profile"
                className="block text-sm px-2 py-2 rounded hover:bg-gray-700 text-center"
            >
                👤 Profile
            </Link>
        </div>
        </>
      )}
    </div>
  );
}
