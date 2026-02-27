function SkeletonCard() {
  return (
    <div className="relative flex-shrink-0 w-[200px] md:w-[240px] lg:w-[280px] animate-pulse">
      <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/50 to-transparent animate-shimmer"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;