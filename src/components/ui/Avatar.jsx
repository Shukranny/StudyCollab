const Avatar = ({ src, alt, size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={src || "https://i.pravatar.cc/150?img=1"}
        alt={alt || "Avatar"}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = "https://i.pravatar.cc/150?img=1"
        }}
      />
    </div>
  )
}

export default Avatar
