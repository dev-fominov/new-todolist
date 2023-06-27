import { ChangeEvent, memo, useState, useEffect } from "react"
import { FilterType } from "../../app/App"
import s from "./Todolist.module.css"
import { tasksThunks } from "../task/tasks.reducer"
import { RequestStatusType } from "../../app/app.reducer"
import { AddItemForm, EditableSpan } from "common/components"
import { todolistsThunks } from "features/todolistsList/todolists.reducer"
import { useActions, useAppSelector } from "common/hooks"
import { GetTaskType } from "features/task/api.task"
import { TaskStatuses } from "common/enums/enums.type"

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

	const { getTasks, addTask, deleteTask, updateTask } = useActions(tasksThunks)
	const { removeTodolist } = useActions(todolistsThunks)

	useEffect(() => {
		getTasks(props.todolistID)
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
		deleteTask({ todolistID, taskID })
	}

	const changeStatusHandler = (todolistID: string, taskId: string, e: ChangeEvent<HTMLInputElement>) => {
		let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
		updateTask({ todolistID, taskId, domainModel: { status } })
	}

	const removeTodolistHandler = () => removeTodolist({ todolistID: props.todolistID })

	const addTaskHandler = (title: string) => {
		addTask({ todolistID: props.todolistID, title })
	}

	const updateTaskHandler = (taskId: string, title: string) => {
		updateTask({ todolistID: props.todolistID, taskId, domainModel: { title } })
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