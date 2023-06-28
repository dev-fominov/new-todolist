import { TodolistDomainType } from "common/types"
import { Task } from "./task/Task"
import { GetTaskType } from "./task/task.api"
import { FC } from "react"
import { useAppSelector } from "common/hooks"
import { TaskStatuses } from "common/enums/enums.type"

type Props = {
	todolist: TodolistDomainType
}

export const Tasks: FC<Props> = ({ todolist }) => {

	const todolistID = todolist.id
	const tasks = useAppSelector<Array<GetTaskType>>(state => state.tasks[todolistID])

	let filteredTasks = tasks

	if (todolist.filter === 'Active') {
		filteredTasks = tasks.filter(el => el.status === TaskStatuses.New)
	} else if (todolist.filter === 'Completed') {
		filteredTasks = tasks.filter(el => el.status === TaskStatuses.Completed)
	} else {
		filteredTasks = tasks
	}

	return (
		<ul>
			{filteredTasks?.map(el => <Task key={el.id} task={el} />)}
		</ul>
	)
}