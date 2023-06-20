import { v1 } from "uuid"
import { TaskAssocType } from "../App"
import { TaskType } from "../Todolist"
import { AddTodolistACType, RemoveTodolistAC, SetTodoLists } from "./todolists-reducer"
import { GetTaskType, ResultCode, TaskPriorities, TaskStatuses, UpdateTaskModelType, todolistAPI } from "../api/api"
import { AppRootStateType } from "./store"
import { setErrorAC, setStatusAC, setStatusACType } from "./app-reducer"
import { handleServerNetworkError } from "../utils/error-utils"


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

export const setTasks = (todoID: string, tasks: GetTaskType[]) => ({
	type: "SET-TASKS",
	payload: { todoID, tasks }
} as const)

export const getTasks = (todoID: string) => (dispatch: any) => {
	dispatch(setStatusAC('loading'))
	todolistAPI.getTasks(todoID)
		.then((res) => {
			console.log(res.data.items)
			dispatch(setTasks(todoID, res.data.items))
			dispatch(setStatusAC('succeeded'))
		})
		.catch((err) => {
			handleServerNetworkError(err.message, dispatch)
		})
}

export const addTaskTC = (todolistID: string, title: string) => (dispatch: any) => {
	dispatch(setStatusAC('loading'))
	todolistAPI.createTask(todolistID, title)
		.then((res) => {
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(addTaskAC(res.data.data.item))
			} else {
				if (res.data.messages.length > 0) {
					dispatch(setErrorAC(res.data.messages[0]))
				} else {
					dispatch(setErrorAC('Some error'))
				}
			}
			dispatch(setStatusAC('idle'))

		})
		.catch((err) => {
			handleServerNetworkError(err.message, dispatch)
		})
}

export const deleteTaskTC = (todolistID: string, taskId: string) => (dispatch: any) => {
	dispatch(setStatusAC('loading'))
	todolistAPI.deleteTask(todolistID, taskId)
		.then((res) => {
			dispatch(removeTaskAC(todolistID, taskId))
			dispatch(setStatusAC('succeeded'))
		})
		.catch((err) => {
			handleServerNetworkError(err.message, dispatch)
		})
}

interface FlexType {
	description?: string
	title?: string
	status?: TaskStatuses
	priority?: TaskPriorities
	startDate?: string
	deadline?: string
}

export const updateTaskTC = (todolistID: string, taskId: string, data: FlexType) => (dispatch: any, getState: () => AppRootStateType) => {
	dispatch(setStatusAC('loading'))
	const task = getState().tasks[todolistID].find(t => t.id === taskId)

	if (task) {
		const model: UpdateTaskModelType = {
			title: task.title,
			description: task.description,
			priority: task.priority,
			startDate: task.startDate,
			deadline: task.deadline,
			status: task.status,
			...data

		}
		todolistAPI.updateTask(todolistID, taskId, model)
			.then((res) => {
				dispatch(updateTaskAC(todolistID, taskId, model))
				dispatch(setStatusAC('succeeded'))
			})
			.catch((err) => {
				handleServerNetworkError(err.message, dispatch)
			})
	}
}