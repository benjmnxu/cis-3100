import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:8000/api";

export default function UploadRecipe() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState();
  const [cookTime, setCookTime] = useState();
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [image, setImage] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/recipes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description: description,
          ingredients: ingredients.split("\n"),
          instructions,
          prep_time: prepTime,
          cook_time: cookTime,
          cuisine_type: cuisine,
          difficulty_level: difficulty,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit recipe");
      const { id: recipeId } = await res.json();

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("recipe_id", recipeId.toString());

        const imgRes = await fetch(`${BASE_URL}/images`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        if (!imgRes.ok) throw new Error("Failed to upload image");
      }

      setSuccess(true);
      setTitle("");
      setIngredients("");
      setInstructions("");
      setDescription("");
      setImage(null);

      const navigate = useNavigate();
      navigate(`/recipe/${recipeId.toString()}`)
    } catch (err) {
      console.error(err);
      alert("There was a problem submitting your recipe.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Upload a Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && <p className="text-green-600 font-semibold">Recipe uploaded!</p>}

        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          type="text"
          placeholder="Recipe Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-24"
          required
        />
        <textarea
          placeholder="Ingredients (one per line)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full p-2 border rounded h-32"
          required
        />
        <textarea
          placeholder="Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full p-2 border rounded h-40"
          required
        />
        <input
          type="text"
          placeholder="Cuisine (e.g. Italian, Mexican)"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Prep Time (minutes)"
          value={prepTime}
          onChange={(e) => setPrepTime((e.target.value))}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Cook Time (minutes)"
          value={cookTime}
          onChange={(e) => setCookTime((e.target.value))}
          className="w-full p-2 border rounded"
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full mb-4"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Recipe
        </button>
      </form>
    </div>
  );
}
