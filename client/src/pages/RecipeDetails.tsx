import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Recipe, mockData } from "../types/types";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = new Response(JSON.stringify(mockData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch recipe");

        const data = await res.json();
        const found = data.find((r: Recipe) => r.id === Number(id));
        setRecipe(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!recipe) return <div className="p-4">Recipe not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <p className="text-gray-700 mb-4">{recipe.description}</p>

      <h2 className="text-xl font-semibold mb-2">Instructions</h2>
      <p className="text-gray-700">{recipe.instructions}</p>

      <button onClick={() => window.history.back()} className="text-blue-600 hover:underline mt-6 block">
        ← Back to search
      </button>
    </div>
  );
}
