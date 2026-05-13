interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
}: StarRatingProps) {
  const starSize = sizeMap[size];

  return (
    <div className="inline-flex items-center gap-1" aria-label={`${rating} de ${max} estrelas`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        const percent = partial ? Math.round((rating - Math.floor(rating)) * 100) : 0;

        return (
          <svg
            key={i}
            className={starSize}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <defs>
              {partial && (
                <linearGradient id={`star-partial-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset={`${percent}%`} stopColor="#C89B3C" />
                  <stop offset={`${percent}%`} stopColor="#E7DDD2" />
                </linearGradient>
              )}
            </defs>
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              fill={
                filled
                  ? "#C89B3C"
                  : partial
                  ? `url(#star-partial-${i})`
                  : "#E7DDD2"
              }
            />
          </svg>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-graphite">{rating}</span>
      )}
    </div>
  );
}
