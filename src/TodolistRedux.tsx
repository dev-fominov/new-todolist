import { ChangeEvent, memo, useState, useEffect } from "react"
import { FilterType } from "./App"
import s from "./Todolist.module.css"
import { AddItemForm } from "./AddItemForm"
import { EditableSpan } from "./EditableSpan"
import { useAppDispatch, useAppSelector } from "./reducers/store"
import { deleteTaskTC, getTasks, addTaskTC, updateTaskTC } from "./reducers/tasks-reducer"
import { removeTodolistTC } from "./reducers/todolists-reducer"
import { GetTaskType, TaskStatuses } from "./api/api"
import { RequestStatusType } from "./reducers/app-reducer"

type PropsType = {
	title: string
	todolistID: string
	filter: FilterType
	entityStatus: RequestStatusType
}

export type TaskType = {
	id: string
	title: string
	isDone: boolean
}

export const TodolistRedux = memo((props: PropsType) => {

	const dispatch = useAppDispatch()

	useEffect(() => {
		dispatch(getTasks(props.todolistID))
	}, [])

	const tasks = useAppSelector<Array<GetTaskType>>(state => state.tasks[props.todolistID])
	
	
	const [fValueNEW, setFValueNEW] = useState<FilterType>('All')
	const [btnName, setBtnName] = useState<FilterType>('All')

	const filterTasks = (filterValue: FilterType) => {
		setFValueNEW(filterValue)
		setBtnName(filterValue)
	}

	let filteredTasks = tasks

	// if (fValueNEW === 'Active') {
	// 	filteredTasks = tasks.filter(el => el.isDone)
	// } else if (fValueNEW === 'Completed') {
	// 	filteredTasks = tasks.filter(el => !el.isDone)
	// } else {
	// 	filteredTasks = tasks
	// }

	const removeTaskHandler = (todolistID: string, taskID: string) => {
		dispatch(deleteTaskTC(todolistID, taskID))
	}

	const changeStatusHandler = (todolistID: string, taskID: string, e: ChangeEvent<HTMLInputElement>) => {
		let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
		dispatch(updateTaskTC(todolistID, taskID, {status: status}))
	}

	const removeTodolistHandler = () => {
		dispatch(removeTodolistTC(props.todolistID))
	}

	const addTaskHandler = (title: string) => {
		dispatch(addTaskTC(props.todolistID, title))
	}

	const updateTaskHandler = (taskID: string, updateTitle: string) => {
		dispatch(updateTaskTC(props.todolistID, taskID, {title: updateTitle}))
	}

	return (
		<div className="todolist">
			<h3>
				<button disabled={props.entityStatus === 'loading'} onClick={removeTodolistHandler}>x</button>
				{props.title}
			</h3>
			<AddItemForm callBack={addTaskHandler} />
			<ul>
				{filteredTasks?.map(el => {

					return (
						<li key={el.id} className={el.status ? s.isDone : ''}>
							<button onClick={() => removeTaskHandler(props.todolistID, el.id)}>x</button>
							<input type="checkbox" checked={el.status === TaskStatuses.Completed} onChange={(e) => changeStatusHandler(props.todolistID, el.id, e)} />
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
}, (prevProps: Readonly<PropsType>, nextProps: Readonly<PropsType>) => {
	if (prevProps.todolistID !== nextProps.todolistID) {
		return true
	} else {
		return false
	}
})