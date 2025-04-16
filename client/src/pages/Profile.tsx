import RecipeCard from "../components/RecipeCard";
import margheritaPizza from "../assets/margherita-pizza.jpeg";

export default function Profile() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?u=jane",
    bio: "Food enthusiast. Loves baking and trying new recipes.",
    joined: "March 2024",
  };

  const favorites = Array(12).fill({
    id: 1,
    title: "Margherita Pizza",
    image: margheritaPizza,
    description: "Classic pizza with tomato, mozzarella, and basil.",
  });

  return (
    <div className="min-h-screen px-4 py-8 overflow-y-auto">
      {/* Profile card */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center border">
          <img
            src={user.avatar}
            alt="User avatar"
            className="w-24 h-24 rounded-full mx-auto mb-4 border"
          />
          <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
          <p className="text-sm text-gray-500 mb-4">{user.email}</p>
          <p className="text-gray-700 text-sm mb-6">{user.bio}</p>
          <div className="text-xs text-gray-400">Joined: {user.joined}</div>
        </div>
      </div>

      {/* Favorite Recipes */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Favorite Recipes</h2>
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
          {favorites.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
