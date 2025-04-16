import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import { Recipe, mockData } from "../types/types"
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
  
    const handleSearch = (query: string) => {
      navigate(`/search?query=${encodeURIComponent(query)}`);
    };

  return (
    <main className="min-h-screen bg-cream text-gray-800 font-sans px-4">
      <section className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Kitchen Scout</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Easy, delicious, and inspiring recipes for every occasion.
          </p>
        </div>

        <SearchBar onSearch={handleSearch}/>

        <div className="border-t pt-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Your Favorite Recipes</h2>
            <div className="flex-wrap justify-center">
              <RecipeCard {...mockData[0]} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-center mb-4">Trending Recipes</h2>
            <div className="flex-wrap justify-center">
              <RecipeCard {...mockData[1]} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
