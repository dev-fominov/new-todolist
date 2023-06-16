import { ChangeEvent, useState, useEffect } from "react"
import { FilterType } from "./App"
import s from "./Todolist.module.css"
import { AddItemForm } from "./AddItemForm"
import { EditableSpan } from "./EditableSpan"

type PropsType = {
	title: string
	todolistID: string
	filter: FilterType
	tasks: TaskType[]
	updateTask: (todolistID: string, taskID: string, updateTitle: string) => void
	removeTask: (todolistID: string, taskID: string) => void
	removeTodolist: (todolistID: string) => void
	addTask: (todolistID: string, title: string) => void
	changeStatus: (todolistID: string, taskID: string, checked: boolean) => void
}

export type TaskType = {
	id: string
	title: string
	isDone: boolean
}

export const Todolist = (props: PropsType) => {

	

	const [fValueNEW, setFValueNEW] = useState<FilterType>('All')
	const [btnName, setBtnName] = useState<FilterType>('All')

	const filterTasks = (filterValue: FilterType) => {
		setFValueNEW(filterValue)
		setBtnName(filterValue)
	}

	let filteredTasks = props.tasks

	if (fValueNEW === 'Active') {
		filteredTasks = props.tasks.filter(el => el.isDone)
	} else if (fValueNEW === 'Completed') {
		filteredTasks = props.tasks.filter(el => !el.isDone)
	} else {
		filteredTasks = props.tasks
	}

	const removeTaskHandler = (todolistID: string, taskID: string) => {
		props.removeTask(todolistID, taskID)
	}

	const changeStatusHandler = (todolistID: string, taskID: string, e: ChangeEvent<HTMLInputElement>) => {
		props.changeStatus(todolistID, taskID, e.currentTarget.checked)
	}

	const removeTodolistHandler = () => {
		props.removeTodolist(props.todolistID)
	}

	const addTaskHandler = (title: string) => {
		props.addTask(props.todolistID, title)
	}

	const updateTaskHandler = (taskID: string, updateTitle: string) => {
		props.updateTask(props.todolistID, taskID, updateTitle)
	}

	return (
		<div>
			<h3>
				<button onClick={removeTodolistHandler}>x</button>
				{props.title}
			</h3>
			<AddItemForm callBack={addTaskHandler} />
			<ul>
				{filteredTasks.map(el => {

					return (
						<li key={el.id} className={el.isDone ? s.isDone : ''}>
							<button onClick={() => removeTaskHandler(props.todolistID, el.id)}>x</button>
							<input type="checkbox" checked={el.isDone} onChange={(e) => changeStatusHandler(props.todolistID, el.id, e)} />
							<EditableSpan callBack={(updateTitle: string) => updateTaskHandler(el.id, updateTitle)} oldTitle={el.title} />
						</li>
					)
				})}
			</ul>
			<div>
				<button className={btnName === 'All' ? s.activeFilter : ''} onClick={() => filterTasks('All')}>All</button>
				<button className={btnName === 'Active' ? s.activeFilter : ''} onClick={() => filterTasks('Active')}>Active</button>
				<button className={btnName === 'Completed' ? s.activeFilter : ''} onClick={() => filterTasks('Completed')}>Completed</button>
			</div>
		</div>
	)
}