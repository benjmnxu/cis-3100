type Props = {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
  };
  
  export default function RecipeCard({ id, title, imageUrl, description }: Props) {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden w-full max-w-[200px] text-sm mx-auto">
        <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
        <div className="p-2">
          <h3 className="font-semibold text-base mb-1">{title}</h3>
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">{description}</p>
          <a
            href={`/recipes/${id}`}
            className="text-blue-500 font-medium text-xs hover:underline"
          >
            View →
          </a>
        </div>
      </div>
    );
  }
  