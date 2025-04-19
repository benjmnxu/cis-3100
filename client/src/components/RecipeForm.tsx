import { FormEvent } from 'react';
import { ImageObject } from '../types/types';

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
  images: File[] | ImageObject[];
  setImages: (f: File[] | ImageObject[]) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function RecipeForm({
  title, setTitle,
  description, setDescription,
  ingredients, setIngredients,
  ingredientInput, setIngredientInput,
  instructions, setInstructions,
  prepTimeInput, setPrepTimeInput,
  cookTimeInput, setCookTimeInput,
  cuisine, setCuisine,
  difficulty, setDifficulty,
  images, setImages,
  onSubmit,
}: RecipeFormProps) {
  const [toDelete, setToDelete] = useState<string[]>([]);
  const handleIngredientKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && ingredientInput.trim()) {
      e.preventDefault();
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
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
        />
        <ul className="mt-2 list-disc pl-5">
          {ingredients.map((ing, i) => (
            <li key={i} className="flex items-center justify-between">
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
          />
        </div>
      </div>
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
      <div>
      <label className="block font-medium mb-1">Images</label>
      <div className="relative inline-block">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => {
            const files = e.target.files;
            if (!files) return;
            setImages(Array.from(files));
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <button
          type="button"
          className="
            border
            !border-black
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
      {images?.length > 0 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((obj, i) => {
            if (obj instanceof File) {
              const file = obj
              const url = URL.createObjectURL(file);
              return (
                <div key={i} className="relative flex-shrink-0">
                  <img
                    src={url}
                    alt={file.name}
                    className="h-24 w-auto rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImages(images.filter((_, idx) => idx !== i));
                      URL.revokeObjectURL(url);
                    }}
                    className="
                      absolute top-1 right-1
                      bg-white/75
                      hover:bg-white/90
                      rounded-full
                      w-5 h-5
                      flex items-center justify-center
                      "
                  >
                    <span className="text-sm font-bold text-gray-800">x</span>
                  </button>
                </div>
              );
            } else {
              return (
                <div key={i} className="relative flex-shrink-0">
                  <img
                    src={obj.file_path}
                    alt={obj.id}
                    className="h-24 w-auto rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setToDelete(...toDelete, images[i].id);
                      setImages(images.filter((_, idx) => idx !== i));
                    }}
                    className="
                      absolute top-1 right-1
                      bg-white/75
                      hover:bg-white/90
                      rounded-full
                      w-5 h-5
                      flex items-center justify-center
                      "
                  >
                    <span className="text-sm font-bold text-gray-800">x</span>
                  </button>
                </div>
              );
            }
          })}
        </div>
      )}
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Submit
      </button>
    </form>
  );
}