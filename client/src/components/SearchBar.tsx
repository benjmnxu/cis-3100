// src/components/SearchBar.tsx
import { useState, useEffect, useRef } from "react";
import { Recipe } from "../types/types";

const BASE_URL = "http://localhost:8000/api";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (results: Recipe[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading, setLoading] = useState(false);

  // Search history
  const [history, setHistory] = useState<
    { query: string; results_count: number }[]
  >([]);

  // dropdown open?
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // fetch history on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`${BASE_URL}/search-history`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setHistory(await res.json());
      } catch (err) {
        console.error("Failed to load search history:", err);
      }
    }
    fetchHistory();
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsHistoryOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSearch = async (q: string = query) => {
    if (!q.trim() && !cuisine && !difficulty) return;
    setLoading(true);

    try {
      const params = new URLSearchParams();
      if (q) params.append("search", q);
      if (cuisine) params.append("cuisine", cuisine);
      if (difficulty) params.append("difficulty", difficulty);

      const res = await fetch(`${BASE_URL}/recipes?${params}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Recipe[] = await res.json();
      onSearch(data);

      const histRes = await fetch(`${BASE_URL}/search-history`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, results_count: data.length }),
      });
      if (!histRes.ok) throw new Error(`History error ${histRes.status}`);

      setHistory((prev) => {
        const withoutDupes = prev.filter((h) => h.query !== q);
        return [{ query: q, results_count: data.length }, ...withoutDupes];
      });
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
      setIsHistoryOpen(false);
    }
  };

  const handleHistoryClick = (q: string) => {
    setQuery(q);
    handleSearch(q);
    setIsHistoryOpen(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4" ref={wrapperRef}>
      <div className="relative">
        <div className="flex items-center gap-2 p-2 border rounded">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsHistoryOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="flex-grow px-3 py-2 border rounded"
          />
          <button
            onClick={() => {
              handleSearch();
              setIsHistoryOpen(false);
            }}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {loading ? "Searching..." : "Go"}
          </button>
        </div>

        {isHistoryOpen && history.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border rounded shadow max-h-60 overflow-y-auto z-10">
            {history.slice(0, 8).map((h, i) => (
              <li
                key={i}
                onMouseDown={() => handleHistoryClick(h.query)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between text-sm"
              >
                <span>{h.query}</span>
                <span className="text-gray-500">({h.results_count})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-2">
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">All Cuisines</option>
          <option value="Mexican">Mexican</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
          <option value="American">American</option>
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="flex-1 p-2 border rounded"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>
  );
}
