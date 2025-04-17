// src/pages/Home.tsx
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { Recipe, mockData } from "../types/types";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // state for fetched favorites
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [favError, setFavError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/favorites", {
          method: "GET",
          credentials: "include", // if your API uses cookies/session
        });
        if (res.status === 401) {
          setFavError("Please log in to see your favorites.");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Recipe[] = await res.json();
        setFavorites(data);
      } catch (err: any) {
        console.error("Failed to load favorites:", err);
        setFavError(err.message || "Unknown error");
      } finally {
        setLoadingFavs(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?query=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen text-gray-800 font-sans px-4">
      <section className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Kitchen Scout</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Easy, delicious, and inspiring recipes for every occasion.
          </p>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        {/* Favorites & Trending */}
        <div className="border-t pt-6 space-y-6">
          {/* Favorites */}
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Your Favorite Recipes</h2>
            {loadingFavs ? (
              <p className="text-center text-gray-500">Loading favorites…</p>
            ) : favError ? (
              <p className="text-center text-red-500">{favError}</p>
            ) : favorites.length === 0 ? (
              <p className="text-center text-gray-500">No favorites yet.</p>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                {favorites.map((r) => (
                  <RecipeCard key={r.id} {...r} />
                ))}
              </div>
            )}
          </div>

          {/* Trending */}
          {/* <div>
            <h2 className="text-xl font-semibold text-center mb-4">Trending Recipes</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {mockData.map((r) => (
                <RecipeCard key={r.id} {...r} />
              ))}
            </div>
          </div> */}
        </div>
      </section>
    </main>
  );
}
