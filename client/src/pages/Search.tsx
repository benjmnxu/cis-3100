import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { Recipe } from "../types/types";
import { useLocation } from "react-router-dom";

export default function SearchRecipes() {
  const location = useLocation();
  const incomingResults = location.state?.results as Recipe[] | undefined;
  const incomingParams = location.state?.params as {query: string, cuisine: string, difficulty: string} | null;

  const [results, setResults] = useState<Recipe[]>(incomingResults || []);

  function handleResult(_: {
    query: string;
    cuisine: string;
    difficulty: string;
    }, 
    results: Recipe[]) {
      setResults(results)
  }

  useEffect(() => {
    if (incomingResults) {
      setResults(incomingResults);
    }
  }, []); 

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-center">
        Search Recipes
      </h1>
      <SearchBar onSearch={handleResult} params={incomingParams}/>
      {results.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]">
          {results.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          No Results
        </div>
      )}
    </div>
  );
}
