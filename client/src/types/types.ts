export type Recipe = {
    id: number;
    user_id: string;
    title: string;
    imageUrl: string;
    description: string;
    ingredients: string[];
    instructions: string;
    prep_time: number;
    cook_time: number;
    cuisine_type: string;
    difficulty_level: string;
    created_at: string;
    is_favorited: boolean;
  };

export type ImageObject = {
  file_path: string;
  id: string;
  uploaded_at: string;
}

export type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  reviewer_email: string;
}