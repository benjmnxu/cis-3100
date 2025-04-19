import { useState, FormEvent } from 'react';
import ReactDOM from 'react-dom';
import RecipeForm from './RecipeForm';
import { Recipe, ImageObject } from '../types/types';

interface EditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  existingImages: ImageObject[]
  onSave: (updated: Partial<Recipe>) => Promise<void>;
}

export default function EditRecipeModal({ isOpen, onClose, recipe, existingImages, onSave }: EditRecipeModalProps) {
    const [title, setTitle] = useState(recipe.title);
    const [description, setDescription] = useState(recipe.description);
    const [ingredients, setIngredients] = useState<string[]>(recipe.ingredients);
    const [ingredientInput, setIngredientInput] = useState('');
    const [instructions, setInstructions] = useState(recipe.instructions);
    const [prepTimeInput, setPrepTimeInput] = useState(String(recipe.prep_time));
    const [cookTimeInput, setCookTimeInput] = useState(String(recipe.cook_time));
    const [cuisine, setCuisine] = useState(recipe.cuisine_type);
    const [difficulty, setDifficulty] = useState(recipe.difficulty_level);
    const [images, setImages] = useState<ImageObject[]>(existingImages);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSave({
        title,
        description,
        ingredients,
        instructions,
        prep_time: Number(prepTimeInput),
        cook_time: Number(cookTimeInput),
        cuisine_type: cuisine,
        difficulty_level: difficulty,
    });
    onClose();
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-h-[90vh] overflow-y-auto max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          aria-label="Close edit modal"
        >
          x
        </button>
        <h2 className="text-2xl font-semibold mb-4">Edit Recipe</h2>
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
    </div>,
    document.body
  );
}