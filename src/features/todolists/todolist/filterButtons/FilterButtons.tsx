import { FilterType, TodolistDomainType } from "common/types"
import { useState, FC } from "react"
import s from "./styles.module.css"
import { useActions } from "common/hooks"
import { todolistsActions } from "../../todolists.slice"

type Props = {
	todolist: TodolistDomainType
}

export const FilterButtons: FC<Props> = ({ todolist }) => {

	const todolistID = todolist.id
	const { changeFilterTasks } = useActions(todolistsActions)

	const [btnName, setBtnName] = useState<FilterType>(todolist.filter)
	const filterTasks = (filter: FilterType) => {
		changeFilterTasks({ todolistID, filter })
		setBtnName(filter)
	}


	return (
		<>
			<button
				className={btnName === 'All' ? s.activeFilter : ''}
				onClick={() => filterTasks('All')}>All</button>
			<button
				className={btnName === 'Active' ? s.activeFilter : ''}
				onClick={() => filterTasks('Active')}>Active</button>
			<button
				className={btnName === 'Completed' ? s.activeFilter : ''}
				onClick={() => filterTasks('Completed')}>Completed</button>
		</>
	)
}