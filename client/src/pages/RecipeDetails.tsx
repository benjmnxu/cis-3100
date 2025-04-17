import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Recipe, Review } from "../types/types";

const BASE_URL = "http://localhost:8000/api";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No recipe ID provided.");
      setLoading(false);
      return;
    }
    async function fetchRecipe() {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/recipes/${encodeURIComponent(id)}`, {
          credentials: "include",
        });
        if (res.status === 404) {
          setRecipe(null);
        } else if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        } else {
          const dataRaw = await res.json();
          const ingredientsField = dataRaw.ingredients;
          const ingredientsArr: string[] = Array.isArray(ingredientsField)
            ? ingredientsField
            : typeof ingredientsField === "string"
            ? ingredientsField
                .split(/\n/)
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [];
          setRecipe({ ...dataRaw, ingredients: ingredientsArr });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  async function fetchReviews() {
    if (!id) return;
    setReviewLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/reviews/recipe/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Review[] = await res.json();
      setReviews(data);
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleFavorite = async () => {
    if (!recipe) return;
    setFavLoading(true);
    setFavError(null);
    try {
      const res = await fetch(`${BASE_URL}/favorites`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe_id: recipe.id }),
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setIsFavorited(true);
    } catch (err: any) {
      console.error(err);
      setFavError(err.message || "Could not favorite");
    } finally {
      setFavLoading(false);
    }
  };

  const handleUnfavorite = async () => {
    if (!recipe) return;
      setFavLoading(true);
      setFavError(null);
      try {
        const res = await fetch(`${BASE_URL}/favorites/${recipe.id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.status === 401) {
          navigate("/login");
          return;
        }
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setIsFavorited(false);
      } catch (err: any) {
        setFavError(err.message || "Could not remove favorite");
      } finally {
        setFavLoading(false);
      }
    };

  const handleReviewSubmit = async () => {
    setReviewError(null);
    setFavLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe_id: recipe!.id,
          rating,
          comment,
        }),
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      // refresh list
      await fetchReviews();
      setRating(0);
      setComment("");
        } catch (err: any) {
          setReviewError(err.message);
        } finally {
          setFavLoading(false);
        }
      };
    
  const handleDeleteReview = async (recipeId: string) => {
    setReviewError(null);
    setFavLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/reviews/${recipeId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchReviews();
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!recipe) return <div className="p-4">Recipe not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <button
          onClick={isFavorited ? handleUnfavorite : handleFavorite}
          disabled={favLoading}
          className={`
            px-4 py-2 rounded
            ${isFavorited ? "bg-red-500" : "bg-blue-600"}
            text-white hover:opacity-90 disabled:opacity-50
          `}
        >
          {favLoading
            ? isFavorited ? "Removing Recipe" : "Favoriting Recipe"
            : isFavorited ? "Remove Favorite" : "Add to Favorites"}
        </button>
      </div>

      {favError && <div className="text-sm text-red-500">{favError}</div>}

      <div className="text-sm text-gray-500">
        {new Date(recipe.created_at).toLocaleDateString()} • {recipe.cuisine_type} • Difficulty: {recipe.difficulty_level}
      </div>

      <p className="text-gray-700 whitespace-pre-wrap">{recipe.description}</p>

      <section>
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside space-y-1">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Instructions</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{recipe.instructions}</p>
      </section>

      <div className="flex gap-4 text-sm text-gray-600">
        <div>Prep: {recipe.prep_time} min</div>
        <div>Cook: {recipe.cook_time} min</div>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>

        {reviewLoading ? (
          <p>Loading reviews…</p>
        ) : reviewError ? (
          <p className="text-red-500">{reviewError}</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="mb-4 border-b pb-2">
              <div className="font-semibold">{r.rating} ★</div>
              <div>{r.comment}</div>
              <div className="text-xs text-gray-500">
                By {r.reviewer_email} on {new Date(r.created_at).toLocaleDateString()}
              </div>
              {r.user_id === "99a84d12-b068-4a23-a695-2f0f5b4c459d" && (
                <button
                  onClick={() => handleDeleteReview(id)}
                  disabled={favLoading}
                  className="text-sm text-red-500 mt-1"
                >
                  Delete Review
                </button>
              )}
            </div>
          ))
        )}

        {/* Review form */}
        <div className="mt-4 space-y-2">
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-1 rounded"
          >
            <option value={0}>Rate…</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="Write your review…"
          />

          <button
            onClick={handleReviewSubmit}
            disabled={favLoading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {favLoading ? "Saving…" : "Submit Review"}
          </button>
        </div>
      </section>
    </div>
  );
}
