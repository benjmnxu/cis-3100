import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // for redirect after logout
import RecipeCard from "../components/RecipeCard";
import { Recipe } from "../types/types";

type UserProfile = {
  id: number;
  email: string;
  name?: string;
  created_at?: string;
};

const BASE_URL = "http://localhost:8000/api";

export default function Profile() {
  const { user: authUser, logout } = useAuth(); // ⬅️ bring in logout
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  async function fetchImages(recipes: Recipe[]): Promise<Recipe[]> {
      return await Promise.all(
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
  }

  useEffect(() => {
    if (!authUser) return;

    const fetchProfile = async () => {
      const res = await fetch(`${BASE_URL}/user/${authUser.id}`, {
        credentials: "include",
      });
      if (!res.ok) return console.error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
    };

    const fetchFavorites = async () => {
      const res = await fetch(`${BASE_URL}/favorites`, {
        credentials: "include",
      });
      if (!res.ok) return console.error("Failed to load favorites");
      const recipes: Recipe[] = await res.json();

      const enriched = await fetchImages(recipes);

      setFavorites(enriched);
    };

    const fetchUserRecipes = async () => {
      const res = await fetch(`${BASE_URL}/recipes/user/${authUser.id}`);
      if (!res.ok) return console.error("Failed to fetch user recipes");
      const recipes: Recipe[] = await res.json();

      const enriched = await fetchImages(recipes);

      setUserRecipes(enriched);
    }

    fetchProfile();
    fetchFavorites();
    fetchUserRecipes();
  }, [authUser]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  if (!authUser || !profile) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen px-4 py-8 overflow-y-auto">
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 w-fit max-w-full text-center border">
          <img
            src={`https://i.pravatar.cc/150?u=${profile.email}`}
            alt="User avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 border"
          />
          <h1 className="text-2xl font-bold mb-1">{profile.name || profile.email}</h1>
          <p className="text-sm text-gray-500 mb-4">{profile.email}</p>
          <div className="text-xs text-gray-400 mb-4">
            Joined: {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Favorite Recipes */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Favorite Recipes</h2>
        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">You haven't favorited any recipes yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
            {favorites.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        )}
        <h2 className="text-xl font-semibold mb-4 mt-4">Your Recipes</h2>
        {userRecipes.length === 0 ? (
          <p className="text-center text-gray-500">You haven't uploaded any recipes yet.</p>
        ) : (
          <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
            {userRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
