import { useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { Recipe } from "../types/types";

export default function SearchRecipes() {
  const [results, setResults] = useState<Recipe[]>([]);

  const handleSearch = async (query: string) => {
    const res = await fetch(`/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-center">Search Recipes</h1>
      <SearchBar onSearch={handleSearch} />
      {results.length > 0 && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]">
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
