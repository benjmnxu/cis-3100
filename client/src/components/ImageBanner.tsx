// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
export interface RecipeImageBannerProps {
    images: string[];
  }

export default function RecipeImageBanner({images}: RecipeImageBannerProps) {
  if (!images || images.length === 0) {
    return <div>No images available for this recipe.</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex overflow-x-auto space-x-2">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Recipe image ${idx + 1}`}
            className="h-48 w-auto rounded-lg flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
