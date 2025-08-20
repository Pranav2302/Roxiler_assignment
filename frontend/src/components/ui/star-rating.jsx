import { StarRating as ExternalStarRating } from 'react-flexible-star-rating'


const sizeMap = {
	sm: 16,
	md: 20,
	lg: 24,
}

export const StarRating = ({ value, onChange, readOnly, className, size = 'sm', ...rest }) => {
	const initialRating = value ?? 0
	const handleChange = (newRating) => {
		// external uses onRatingChange
		onChange?.(newRating)
	}

	return (
		<ExternalStarRating
			key={initialRating}
			initialRating={initialRating}
			onRatingChange={handleChange}
			isReadOnly={!!readOnly}
			dimension={sizeMap[size] || sizeMap.sm}
			{...rest}
		/>
	)
}

export default StarRating
