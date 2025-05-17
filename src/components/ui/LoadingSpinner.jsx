const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-700">Loading...</span>
    </div>
  )
}

export default LoadingSpinner
