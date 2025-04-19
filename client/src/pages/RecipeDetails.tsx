// src/components/RecipeDetail.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageObject, Recipe, Review } from "../types/types";
import { useAuth } from "../context/AuthContext";
import EditRecipeModal from "../components/EditRecipeModal";
import RecipeImageBanner from "../components/ImageBanner";

const BASE_URL = "http://localhost:8000/api";

function parsePgArray(psa: string): string[] {
  let str = psa;
  str = str.slice(3, str.length-3).replace(/\\"/g, "");
  return str.split(",");
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favError, setFavError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingImages, setExistingImages] = useState<ImageObject[]>([]);

  const [optionsMenu, setOptionsMenu] = useState<boolean>(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) {
      setError("No recipe ID provided.");
      setRecipeLoading(false);
      return;
    }
    async function fetchRecipe() {
      setRecipeLoading(true);
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
          const ingredientsArr: string[] = parsePgArray(dataRaw.ingredients)
          setRecipe({ ...dataRaw, ingredients: ingredientsArr });
          setIsFavorited(dataRaw.is_favorited);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load recipe.");
      } finally {
        setRecipeLoading(false);
      }
    }
    async function fetchImages() {
      const res = await fetch(`${BASE_URL}/recipes/${id}/images`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      const abs = data.map(e => ({ ...e, file_path: `http://localhost:8000${e.file_path}`,}));
      setExistingImages(abs);
    }

    fetchRecipe();
    fetchImages();
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

  // Favorite handlers unchanged
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
        navigate("/auth");
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
        navigate("/auth");
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

  // Review create
  const handleReviewSubmit = async () => {
    setReviewError(null);
    setReviewLoading(true);
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
        navigate("/auth");
        return;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchReviews();
      setRating(0);
      setComment("");
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  // Review delete
  const handleDeleteReview = async (recipe_id: string) => {
    setReviewError(null);
    setReviewLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/reviews/${recipe_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 401) {
        navigate("/auth");
        return;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchReviews();
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleStartEdit = (r: Review) => {
    setEditingReviewId(r.id);
    setRating(r.rating);
    setComment(r.comment);
  };

  const handleReviewUpdate = async () => {
    if (!editingReviewId) return;
    setReviewError(null);
    setReviewLoading(true);
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
        navigate("/auth");
        return;
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await fetchReviews();
      setEditingReviewId(null);
      setRating(0);
      setComment("");
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(0);
    setComment("");
  };

  const handleDeleteRecipe = async () => {
    if (!recipe) return;
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
  
    try {
      const res = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      navigate("/profile");
    } catch (err: any) {
      console.error(err);
      setFavError(err.message || "Could not delete recipe");
    }
  };

  if (authLoading || recipeLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!recipe) return <div className="p-4">Recipe not found.</div>;

  const reviewedThisRecipe =
    reviews.length > 0 && user
      ? reviews.some((r) => r.user_id === String(user.id))
      : false;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline move left">
        ← Back
      </button>

      {recipe.imageUrl && (
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-64 object-cover rounded-lg" />
      )}

      <div className="relative flex items-center justify-between">

        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <button
          onClick={()=>setOptionsMenu(!optionsMenu)}
          className="text-white px-4 py-2 rounded bg-black hover:bg-gray-300"
          >
          Options ▼
        </button>
         {optionsMenu && (
          <div
            className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg z-10 min-w-max"
          >
            <button
              onClick={isFavorited ? handleUnfavorite : handleFavorite}
              disabled={favLoading}
              className="block w-full text-left px-4 py-2 bg-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50"
            >
              {favLoading
                ? isFavorited
                  ? "Removing..."
                  : "Adding..."
                : isFavorited
                ? "Remove Favorite"
                : "Add to Favorites"}
            </button>
            
            { user?.id == recipe.user_id && 
             <>
              <button
              onClick={handleDeleteRecipe}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 bg-white"
            >
              Delete Recipe
            </button>

            
            <button
              onClick={() => setIsEditOpen(true)}
              className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100"
            >
              Edit Recipe
            </button>
            </> 
            }
          </div>
        )}
      </div>

      {favError && <div className="text-sm text-red-500">{favError}</div>}
      
      <RecipeImageBanner
        images={existingImages.map(image=>image.file_path)}
      />

      <div className="text-sm text-gray-500">
        {new Date(recipe.created_at).toLocaleDateString()} • {recipe.cuisine_type} • Difficulty:{" "}
        {recipe.difficulty_level}
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
          reviews
          .filter(r=>r.id !== editingReviewId)
          .map((r) => (
            <div key={r.id} className="mb-4 border-b pb-2">
              <div className="font-semibold">{r.rating} ★</div>
              <div>{r.comment}</div>
              <div className="text-xs text-gray-500">
                By {r.reviewer_email} on {new Date(r.created_at).toLocaleDateString()}
              </div>
              {user && r.user_id === String(user.id) && (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleDeleteReview(id)}
                    disabled={reviewLoading}
                    className="text-sm text-red-500"
                  >
                    {reviewLoading ? "Deleting…" : "Delete"}
                  </button>
                  <button
                    onClick={() => handleStartEdit(r)}
                    disabled={reviewLoading}
                    className="text-sm text-blue-500"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        {editingReviewId ? (
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">Edit Your Review</h3>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
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
            />
            <div className="flex gap-2">
              <button
                onClick={handleReviewUpdate}
                disabled={reviewLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {reviewLoading ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={reviewLoading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : !reviewedThisRecipe && !!user ? (
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
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
              disabled={reviewLoading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {reviewLoading ? "Saving…" : "Submit Review"}
            </button>
          </div>
        ) : null}
      </section>

      <EditRecipeModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        recipe={recipe!}
        existingImages={existingImages}
        onSave={async updated => {
          const res = await fetch(`${BASE_URL}/recipes/${recipe!.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          });
          if (res.ok) {
            const dataRaw = await res.json();
            const ingredientsArr: string[] = parsePgArray(dataRaw.ingredients)
            setRecipe({ ...dataRaw, ingredients: ingredientsArr });
            setIsEditOpen(false);
          }
          if (updated.images) {
            updated.images.map(async (image) => {
              const formData = new FormData();
              formData.append("image", image);
              formData.append("recipe_id", recipe!.id.toString());
              const imgRes = await fetch(`${BASE_URL}/images`, {
                method: "POST",
                credentials: "include",
                body: formData,
              });
              if (!imgRes.ok) throw new Error("Failed to upload image");
            })
          }
        }}
      />
    </div>
  );
}
