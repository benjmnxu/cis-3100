import margheritaPizza from "../assets/margherita-pizza.jpeg";
import charSiuBao from "../assets/char-siu-bao.jpg";

export type Recipe = {
    id: number;
    title: string;
    image: string;
    description: string;
    ingredients: string[];
    instructions: string;
    prep_time: number;
    cook_time: number;
    cuisine_type: string;
    difficulty_level: number;
    created_at: string;
  };

export type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  reviewer_email: string;
}

export const mockData: Recipe[] = [
    {
      id: 1,
      title: "Margherita Pizza",
      image: margheritaPizza,
      description: "Classic pizza with tomato, mozzarella, and basil.",
      ingredients: ["Tomato", "Mozzarella", "Basil", "Pizza dough"],
      instructions: "Spread sauce, add cheese and toppings, bake at 475°F for 10-12 minutes.",
      prep_time: 15,
      cook_time: 10,
      cuisine_type: "Italian",
      difficulty_level: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Char Siu Bao",
      image: charSiuBao,
      description: "Fluffy buns filled with sweet and savory BBQ pork.",
      instructions: "Prepare char siu, make dough, fill, steam for 10-12 minutes.",
      ingredients: ["Flour", "BBQ Pork", "Sugar", "Yeast", "Soy Sauce"],
      prep_time: 20,
      cook_time: 15,
      cuisine_type: "Chinese",
      difficulty_level: 2,
      created_at: new Date().toISOString(),
    },
  ];