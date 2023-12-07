import {useState} from "react"

type Direction = "asc" | "desc"
type SortParams<T> = {key: keyof T; direction: Direction}

type UseSortReturn<T> = {
	sortParams: SortParams<T>
	toggleSort: (key: keyof T) => void
}

const useSort = <T extends object = object>(
	initialKey: keyof T,
	initialDirection: Direction = "asc"
): UseSortReturn<T> => {
	const [sortParams, setSortParams] = useState<SortParams<T>>({
		key: initialKey,
		direction: initialDirection,
	})

	const toggleSort = (key: keyof T) => {
		setSortParams((prev) => ({
			key,
			direction: prev.direction === "asc" ? "desc" : "asc",
		}))
	}

	return {sortParams, toggleSort}
}

export {useSort}
