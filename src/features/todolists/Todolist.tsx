import { memo, useEffect, FC } from "react"
import { tasksThunks } from "./todolist/tasks/task/tasks.slice"
import { AddItemForm } from "common/components"
import { useActions } from "common/hooks"
import { TodolistDomainType } from "common/types/types"
import { FilterButtons } from "./todolist/filterButtons/FilterButtons"
import { Tasks } from "./todolist/tasks/Tasks"
import { TodolistTitle } from "./todolist/todolistTitle/TodolistTitle"

type Props = {
	todolist: TodolistDomainType
}

export const Todolist: FC<Props> = memo(({ todolist }) => {
	const todolistID = todolist.id
	const { getTasks, addTask } = useActions(tasksThunks)

	useEffect(() => { getTasks(todolist.id) }, [])

	const addTaskHandler = (title: string) => {
		return addTask({ todolistID, title }).unwrap()
	}

	return (
		<div className="todolist">
			<TodolistTitle todolist={todolist} />
			<AddItemForm callBack={addTaskHandler} />
			<Tasks todolist={todolist} />
			<div>
				<FilterButtons todolist={todolist} />
			</div>
		</div>
	)
}, (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
	if (prevProps.todolist.id !== nextProps.todolist.id) {
		return true
	} else {
		return false
	}
})