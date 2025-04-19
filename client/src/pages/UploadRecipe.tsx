import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";

const BASE_URL = "http://localhost:8000/api";

export default function UploadRecipe() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("")
  const [ingredients, setIngredients] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTimeInput, setPrepTimeInput] = useState<string>("");
  const [cookTimeInput, setCookTimeInput] = useState<string>("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [images, setImages] = useState<File[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ingredients.length < 1) {
      alert("Please include at least one ingredient")
      return;
    }

    const prep_time = prepTimeInput.trim() === "" ? 0 : Number(prepTimeInput);
    const cook_time = cookTimeInput.trim() === "" ? 0 : Number(cookTimeInput);

    try {
      const res = await fetch(`${BASE_URL}/recipes`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          ingredients,
          instructions,
          prep_time,
          cook_time,
          cuisine_type: cuisine,
          difficulty_level: difficulty,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit recipe");
      const { id: recipeId } = await res.json();

      if (images) {
        images.map(async (image) => {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("recipe_id", recipeId.toString());
          const imgRes = await fetch(`${BASE_URL}/images`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });
          if (!imgRes.ok) throw new Error("Failed to upload image");
        })
      }

      setTitle("");
      setDescription("");
      setIngredients([]);
      setInstructions("");
      setCuisine("");
      setPrepTimeInput("");
      setCookTimeInput("");
      setImages(null);

      navigate(`/recipes/${recipeId.toString()}`)
    } catch (err) {
      console.error(err);
      alert("There was a problem submitting your recipe.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload a Recipe</h1>
        <RecipeForm
          title={title} setTitle={setTitle}
          description={description} setDescription={setDescription}
          ingredients={ingredients} setIngredients={setIngredients}
          ingredientInput={ingredientInput} setIngredientInput={setIngredientInput}
          instructions={instructions} setInstructions={setInstructions}
          prepTimeInput={prepTimeInput} setPrepTimeInput={setPrepTimeInput}
          cookTimeInput={cookTimeInput} setCookTimeInput={setCookTimeInput}
          cuisine={cuisine} setCuisine={setCuisine}
          difficulty={difficulty} setDifficulty={setDifficulty}
          images={images} setImages={setImages}
          onSubmit={handleSubmit}
        />
    </div>
  );
}
