import { v1 } from "uuid"
import { TaskAssocType } from "../App"
import { TaskType } from "../Todolist"
import { AddTodolistACType, RemoveTodolistAC, SetTodoLists } from "./todolists-reducer"
import { GetTaskType, TaskPriorities, TaskStatuses, UpdateTaskModelType, todolistAPI } from "../api/api"
import { AppRootStateType } from "./store"


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


type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type AddTaskACType = ReturnType<typeof addTaskAC>
type UpdateTaskACType = ReturnType<typeof updateTaskAC>


export type setTasksType = ReturnType<typeof setTasks>

export const setTasks = (todoID: string, tasks: GetTaskType[]) => ({
	type: "SET-TASKS",
	payload: { todoID, tasks }
} as const)

export const getTasks = (todoID: string) => (dispatch: any) => {
	todolistAPI.getTasks(todoID).then((res) => {
		console.log(res.data.items)
		dispatch(setTasks(todoID, res.data.items))
	})
}

export const addTaskTC = (todolistID: string, title: string) => (dispatch: any) => {
	todolistAPI.createTask(todolistID, title).then((res) => {
		dispatch(addTaskAC(res.data.data.item))
	})
}

export const deleteTaskTC = (todolistID: string, taskId: string) => (dispatch: any) => {
	todolistAPI.deleteTask(todolistID, taskId).then((res) => {
		dispatch(removeTaskAC(todolistID, taskId))
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
		todolistAPI.updateTask(todolistID, taskId, model).then((res) => {
			console.log(res.data)
			dispatch(updateTaskAC(todolistID, taskId, model))
		})
	}
}