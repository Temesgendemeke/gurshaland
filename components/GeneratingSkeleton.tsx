function GeneratingSkeleton() {
  return (
    <div className="text-center py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
      </div>
      <p className="text-body-muted mt-4">
        AI is creating your personalized recipe...
      </p>
    </div>
  );
}
