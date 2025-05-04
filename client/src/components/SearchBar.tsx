// src/components/SearchBar.tsx
import { useState, useEffect, useRef } from "react";
import { Recipe } from "../types/types";

const BASE_URL = "http://localhost:8000/api";

export default function SearchBar({
  onSearch,
  params,
}: {
  onSearch: (params: {query: string, cuisine: string, difficulty: string}, results: Recipe[]) => void;
  params: {query: string, cuisine: string, difficulty: string} | null;
}) {
  const [query, setQuery] = useState(params?.query || "");
  const [cuisine, setCuisine] = useState(params?.cuisine || "");
  const [difficulty, setDifficulty] = useState(params?.difficulty || "");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<
    { query: string; results_count: number }[]
  >([]);

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
        handleSetHistory(await res.json());
      } catch (err) {
        console.error("Failed to load search history:", err);
      }
    }
    fetchHistory();
  }, []);

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

      const recipes: Recipe[] = await res.json();
      const enriched = await Promise.all(
        recipes.map(async (recipe) => {
          try {
            const imgRes = await fetch(
              `${BASE_URL}/recipes/${recipe.id}/images`,
              { credentials: "include" }
            );

            if (!imgRes.ok) return { ...recipe, imageUrl: "" };

            const images: {
              id: string;
              file_path: string;
              uploaded_at: string;
            }[] = await imgRes.json();

            return {
              ...recipe,
              imageUrl: "http://localhost:8000" + images[0]?.file_path
            }
          } catch {
            return { ...recipe, imageUrl: "" };
          }
        })
      );
      onSearch({query: q, cuisine: cuisine, difficulty: difficulty} ,enriched);

      const histRes = await fetch(`${BASE_URL}/search-history`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, results_count: recipes.length }),
      });
      if (!histRes.ok) throw new Error(`History error ${histRes.status}`);

      setHistory((prev) => {
        const withoutDupes = prev.filter((h) => h.query !== q);
        return [{ query: q, results_count: recipes.length }, ...withoutDupes];
      });

    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetHistory = (rawHistory: { query: string; results_count: number; search_date: string }[]) => {
    const map = new Map<string, { query: string; results_count: number }>();
  
    for (const item of rawHistory) {

      map.set(item.query, {
        query: item.query,
        results_count: item.results_count,
      });
    }
  
    const deduped = Array.from(map.values());
    setHistory(deduped);
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
            {history.slice(0, Math.min(history.length, 8)).map((h, i) => (
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
        <input
          value={cuisine}
          className="flex-1 p-2 border rounded"
          placeholder="All Cuisines"
          onChange={(e) => setCuisine(e.target.value)}
          >
        
        </input>
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
