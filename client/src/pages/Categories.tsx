import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { Recipe } from "../types/types";

export default function CategoriesPage() {
  const { category_id } = useParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  useEffect(() => {
    if (!category_id) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    fetch(`/recipes/category/${category_id}`)
      .then((res) => res.json())
      .then(setRecipes)
      .catch((err) => console.error("Failed to load category recipes", err))
      .finally(() => setLoading(false));
  }, [category_id]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-center">
        {category_id ? `Browse ${category_id} Recipes` : "Browse Categories"}
      </h1>

      {!category_id ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))]">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/categories/${encodeURIComponent(category)}`}
              className="block p-6 bg-gray-100 rounded-lg text-center hover:bg-gray-200 transition"
            >
              {category}
            </Link>
          ))}
        </div>
      ) : loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : recipes.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No recipes found.</p>
      )}

      {category_id && (
        <div className="text-center mt-6">
          <Link to="/categories" className="text-blue-600 hover:underline">
            ← Back to all categories
          </Link>
        </div>
      )}
    </div>
  );
}
