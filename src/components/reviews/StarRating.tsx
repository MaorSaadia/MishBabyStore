import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
}

const StarRating = ({ rating, size = 16, className = "" }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className={`flex ${className}`}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return (
            <Star
              key={`star-${i}`}
              size={size}
              className="text-yellow-400 fill-yellow-400"
            />
          );
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={`star-${i}`} className="relative">
              <Star size={size} className="text-gray-300 fill-gray-300" />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star size={size} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          );
        } else {
          return (
            <Star
              key={`star-${i}`}
              size={size}
              className="text-gray-300 fill-gray-300"
            />
          );
        }
      })}
    </div>
  );
};

export default StarRating;
