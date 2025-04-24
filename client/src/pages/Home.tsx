// src/pages/Home.tsx
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { Recipe } from "../types/types";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api"
export default function Home() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [favError, setFavError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${BASE_URL}/favorites`, {
          method: "GET",
          credentials: "include",
        });
        if (res.status === 401) {
          setFavError("Please log in to see your favorites.");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
                imageUrl: "http://localhost:8000" + images[0]?.file_path,
              };
            } catch {
              return { ...recipe, imageUrl: "" };
            }
          })
        );
        // 3) set into state
        setFavorites(enriched);
      } catch (err: any) {
        console.error("Failed to load favorites:", err);
        setFavError(err.message || "Unknown error");
      } finally {
        setLoadingFavs(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleSearch = (results: Recipe[]) => {
    navigate("/search", { state: { results } });
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
                {favorites.map((r) => {
                  return (
                    <RecipeCard key={r.id} {...r} />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
