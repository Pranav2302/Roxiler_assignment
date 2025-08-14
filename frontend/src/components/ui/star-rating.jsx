import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const StarRating = React.forwardRef(({ 
  value = 0, 
  onChange, 
  readOnly = false, 
  className,
  size = "sm"
}, ref) => {
  const [hoverValue, setHoverValue] = React.useState(0)
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5", 
    lg: "h-6 w-6"
  }

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating)
    }
  }

  const handleMouseEnter = (rating) => {
    if (!readOnly) {
      setHoverValue(rating)
    }
  }

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverValue(0)
    }
  }

  return (
    <div ref={ref} className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClasses[size],
            "transition-colors",
            !readOnly && "cursor-pointer",
            (hoverValue >= star || value >= star)
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-300"
          )}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  )
})

StarRating.displayName = "StarRating"

export { StarRating }
