import React, { FormEvent } from "react";
import { ImageObject } from "../types/types";

export interface RecipeFormProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  ingredients: string[];
  setIngredients: (v: string[]) => void;
  ingredientInput: string;
  setIngredientInput: (v: string) => void;
  instructions: string;
  setInstructions: (v: string) => void;
  prepTimeInput: string;
  setPrepTimeInput: (v: string) => void;
  cookTimeInput: string;
  setCookTimeInput: (v: string) => void;
  cuisine: string;
  setCuisine: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  images: (File | ImageObject)[];
  setImages: React.Dispatch<React.SetStateAction<(File | ImageObject)[]>>;
  onSubmit: (e: FormEvent) => void;
}

// User-defined type guard to distinguish ImageObject from File
function isImageObject(
  obj: File | ImageObject
): obj is ImageObject {
  return (obj as ImageObject).file_path !== undefined;
}

export default function RecipeForm({
  title,
  setTitle,
  description,
  setDescription,
  ingredients,
  setIngredients,
  ingredientInput,
  setIngredientInput,
  instructions,
  setInstructions,
  prepTimeInput,
  setPrepTimeInput,
  cookTimeInput,
  setCookTimeInput,
  cuisine,
  setCuisine,
  difficulty,
  setDifficulty,
  images,
  setImages,
  onSubmit,
}: RecipeFormProps) {
  const handleIngredientKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && ingredientInput.trim()) {
      e.preventDefault();
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput("");
    }
  };

  const handleDeleteExisting = async (img: ImageObject) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/images/${img.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setImages(prev => prev.filter(i => !(isImageObject(i) && i.id === img.id)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded h-24"
          required
          placeholder="What makes this recipe special? How would you describe it?"
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block font-medium">Ingredients</label>
        <input
          type="text"
          value={ingredientInput}
          onChange={e => setIngredientInput(e.target.value)}
          onKeyDown={handleIngredientKeyDown}
          className="w-full p-2 border rounded"
          placeholder="e.g. 2 cups of flour (PRESS 'ENTER' AFTER EACH INPUT)"
        />
        <ul className="mt-2 list-disc pl-3 pr-3">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex border rounded pl-3 bg-gray-50 items-center justify-between mb-1">
              {ing}
              <button
                type="button"
                onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))}
                className="ml-2 text-red-500 text-xs hover:bg-red-100 p-1 rounded"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div>
        <label className="block font-medium">Instructions</label>
        <textarea
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
          className="w-full p-2 border rounded h-40"
          required
          placeholder="Step-by-step instructions..."
        />
      </div>

      {/* Cuisine */}
      <div>
        <label className="block font-medium">Cuisine</label>
        <input
          type="text"
          value={cuisine}
          onChange={e => setCuisine(e.target.value)}
          className="w-full p-2 border rounded"
          required
          placeholder="e.g. Mexican, Japanese"
        />
      </div>

      {/* Prep & Cook Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Prep Time</label>
          <input
            type="number"
            min={0}
            value={prepTimeInput}
            onChange={e => setPrepTimeInput(e.target.value)}
            className="w-full p-2 border rounded"
            required
            placeholder="in minutes"
          />
        </div>
        <div>
          <label className="block font-medium">Cook Time</label>
          <input
            type="number"
            min={0}
            value={cookTimeInput}
            onChange={e => setCookTimeInput(e.target.value)}
            className="w-full p-2 border rounded"
            required
            placeholder="in minutes"
          />
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block font-medium">Difficulty Level</label>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block font-medium mb-1">Images</label>
        <div className="relative inline-block">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={e => {
              if (!e.target.files) return;
              setImages(prev => [
                ...prev,
                ...Array.from(e.target.files),
              ]);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button
            type="button"
            className="
              border !border-black
              bg-transparent
              text-black
              px-4 py-2
              rounded
              hover:bg-black hover:text-white
              transition
            "
          >
            Select Images
          </button>
        </div>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((item, i) =>
            isImageObject(item) ? (
              <div key={item.id} className="relative flex-shrink-0">
                <img
                  src={item.file_path}
                  alt={`img-${item.id}`}
                  className="h-24 w-auto rounded border"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(item)}
                  className="
                    absolute top-1 right-1
                    bg-white/75 rounded-full p-1 text-xs
                  "
                >
                  x
                </button>
              </div>
            ) : (
              <div key={i} className="relative flex-shrink-0">
                {(() => {
                  const url = URL.createObjectURL(item);
                  return (
                    <>
                      <img
                        src={url}
                        alt={item.name}
                        className="h-24 w-auto rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImages(prev => prev.filter((_, idx) => idx !== i));
                          URL.revokeObjectURL(url);
                        }}
                        className="
                          absolute top-1 right-1
                          bg-white/75 rounded-full p-1 text-xs
                        "
                      >
                        x
                      </button>
                    </>
                  );
                })()}
              </div>
            )
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
}
