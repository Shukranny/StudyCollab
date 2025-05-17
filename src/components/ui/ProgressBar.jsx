const ProgressBar = ({ percentage, color = "#2563EB", size = "md", showLabel = true }) => {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.min(Math.max(percentage, 0), 100)

  // Determine height based on size
  const heightClass = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  }[size]

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        {showLabel && (
          <div className="flex justify-between w-full">
            <span className="text-xs font-medium text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-700">{safePercentage}%</span>
          </div>
        )}
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className="rounded-full transition-all duration-300 ease-in-out"
          style={{
            width: `${safePercentage}%`,
            backgroundColor: color,
            height: "100%",
          }}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
