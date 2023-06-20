import { TaskAssocType } from "../App"
import { AddTodolistACType, RemoveTodolistAC, SetTodoLists } from "./todolists-reducer"
import { GetTaskType, ResultCode, TaskPriorities, TaskStatuses, UpdateTaskModelType, todolistAPI } from "../api/api"
import { AppRootStateType, AppThunkType } from "./store"
import { setStatusAC, setStatusACType } from "./app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils"
import axios from "axios"


const initialState: TaskAssocType = {}

export const tasksReducer = (state = initialState, action: TaskReducersType): TaskAssocType => {
	switch (action.type) {
		case "REMOVE-TASK": {
			return { ...state, [action.payload.todolistID]: state[action.payload.todolistID].filter(el => el.id !== action.payload.taskID) }
		}
		case "ADD-TASK": {
			return { ...state, [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]] }
		}
		case "UPDATE-TASK": {
			return { ...state, [action.payload.todolistID]: state[action.payload.todolistID].map(el => el.id === action.payload.taskID ? { ...el, ...action.payload.model } : el) }
		}
		case "ADD-TODOLIST": {
			return { ...state, [action.payload.item.id]: [] }
		}
		case "REMOVE-TODOLIST": {
			let { [action.payload.todolistID3]: [], ...rest } = state
			return rest
		}
		case "SET-TODOLISTS": {
			const copyState = { ...state }
			action.payload.todos.forEach(tl => copyState[tl.id] = [])
			return copyState
		}
		case "SET-TASKS": {
			return { ...state, [action.payload.todoID]: action.payload.tasks }
		}
		default:
			return state
	}
}

export const removeTaskAC = (todolistID: string, taskID: string) => {
	return {
		type: "REMOVE-TASK",
		payload: { todolistID, taskID }
	} as const
}

export const addTaskAC = (task: GetTaskType) => {
	return {
		type: "ADD-TASK",
		payload: { task }
	} as const
}

export const updateTaskAC = (todolistID: string, taskID: string, model: UpdateTaskModelType) => {
	return {
		type: "UPDATE-TASK",
		payload: { todolistID, taskID, model }
	} as const
}

export const setTasks = (todoID: string, tasks: GetTaskType[]) => ({
	type: "SET-TASKS",
	payload: { todoID, tasks }
} as const)

export const getTasks = (todoID: string): AppThunkType => async dispatch => {
	try {
		dispatch(setStatusAC('loading'))
		const res = await todolistAPI.getTasks(todoID)
		dispatch(setTasks(todoID, res.data.items))
		dispatch(setStatusAC('succeeded'))
	} catch (err) {
		if (axios.isAxiosError<ErrorsType>(err)) {
			const messageError = err.response ? err.response.data.message : err.message
			handleServerNetworkError(messageError, dispatch)
		} else {
			const error = (err as Error).message
			console.log(error)
		}
	}
}

export const addTaskTC = (todolistID: string, title: string): AppThunkType => async dispatch => {
	try {
		dispatch(setStatusAC('loading'))
		const res = await todolistAPI.createTask(todolistID, title)
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(addTaskAC(res.data.data.item))
		} else {
			handleServerAppError<{ item: GetTaskType }>(res.data, dispatch)
		}
		dispatch(setStatusAC('succeeded'))
	} catch (err) {
		if (axios.isAxiosError<ErrorsType>(err)) {
			const messageError = err.response ? err.response.data.message : err.message
			handleServerNetworkError(messageError, dispatch)
		} else {
			const error = (err as Error).message
			console.log(error)
		}
	}
}

export const deleteTaskTC = (todolistID: string, taskId: string): AppThunkType => async dispatch => {
	try {
		dispatch(setStatusAC('loading'))
		await todolistAPI.deleteTask(todolistID, taskId)
		dispatch(removeTaskAC(todolistID, taskId))
		dispatch(setStatusAC('succeeded'))
	} catch (err) {
		if (axios.isAxiosError<ErrorsType>(err)) {
			const messageError = err.response ? err.response.data.message : err.message
			handleServerNetworkError(messageError, dispatch)
		} else {
			const error = (err as Error).message
			console.log(error)
		}
	}
}

export const updateTaskTC = (todolistID: string, taskId: string, data: FlexType): AppThunkType =>
	async (dispatch, getState: () => AppRootStateType) => {

		dispatch(setStatusAC('loading'))
		const task = getState().tasks[todolistID].find(t => t.id === taskId)

		if (!task) {
			console.log('Task not found')
			return
		}
		const model: UpdateTaskModelType = {
			title: task.title,
			description: task.description,
			priority: task.priority,
			startDate: task.startDate,
			deadline: task.deadline,
			status: task.status,
			...data

		}

		try {
			const res = await todolistAPI.updateTask(todolistID, taskId, model)
			if (res.data?.resultCode === ResultCode.OK) {
				dispatch(updateTaskAC(todolistID, taskId, model))
				dispatch(setStatusAC('succeeded'))
			} else {
				handleServerAppError<{ item: GetTaskType }>(res.data, dispatch)
			}
		} catch (err) {
			if (axios.isAxiosError<ErrorsType>(err)) {
				const messageError = err.response ? err.response.data.message : err.message
				handleServerNetworkError(messageError, dispatch)
			} else {
				const error = (err as Error).message
				console.log(error)
			}
		}
	}



export type ErrorsType = {
	field: string
	message: string
}

interface FlexType {
	description?: string
	title?: string
	status?: TaskStatuses
	priority?: TaskPriorities
	startDate?: string
	deadline?: string
}


export type TaskReducersType = RemoveTaskACType
	| AddTaskACType
	| UpdateTaskACType
	| AddTodolistACType
	| RemoveTodolistAC
	| SetTodoLists
	| setTasksType
	| setStatusACType


type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type AddTaskACType = ReturnType<typeof addTaskAC>
type UpdateTaskACType = ReturnType<typeof updateTaskAC>

export type setTasksType = ReturnType<typeof setTasks>