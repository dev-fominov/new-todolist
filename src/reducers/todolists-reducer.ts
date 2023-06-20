import axios from "axios";
import { TodolistDomainType } from "../App";
import { GetTodolistType, ResultCode, todolistAPI } from "../api/api";
import { handleServerAppError, handleServerNetworkError } from "../utils/error-utils";
import { RequestStatusType, setErrorAC, setStatusAC, setStatusACType } from "./app-reducer";
import { ErrorsType } from "./tasks-reducer";
import { AppThunkType } from "./store";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state = initialState, action: TodolistReducersType): TodolistDomainType[] => {
	switch (action.type) {
		case "ADD-TODOLIST": {
			console.log(state)
			return [{ ...action.payload.item, filter: 'All', entityStatus: 'idle' }, ...state]
		}
		case "REMOVE-TODOLIST": {
			return state.filter(el => el.id !== action.payload.todolistID3)
		}
		case "SET-TODOLISTS": {
			return action.payload.todos.map((tl) => ({ ...tl, filter: 'All', entityStatus: 'idle' }))
		}
		case "SET-ENTITY-STATUS": {
			return state.map(el => el.id === action.payload.todolistID ? { ...el, entityStatus: action.payload.entityStatus } : el)
		}
		default:
			return state
	}
}

export const addTodolistAC = (item: GetTodolistType) => {
	return {
		type: "ADD-TODOLIST",
		payload: { item }
	} as const
}
export const removeTodolistAC = (todolistID3: string) => {
	return {
		type: "REMOVE-TODOLIST",
		payload: { todolistID3 }
	} as const
}

export const setTodoLists = (todos: GetTodolistType[]) => ({
	type: 'SET-TODOLISTS',
	payload: { todos }
} as const)


export const setEntityStatus = (todolistID: string, entityStatus: RequestStatusType) => ({
	type: 'SET-ENTITY-STATUS',
	payload: { todolistID, entityStatus }
} as const)

export const getTodos = (): AppThunkType => async dispatch => {
	dispatch(setStatusAC('loading'))
	try {
		const res = await todolistAPI.getTodolists()
		dispatch(setTodoLists(res.data))
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

export const addTodolistTC = (title: string): AppThunkType => async dispatch => {
	dispatch(setStatusAC('loading'))
	try {

		const res = await todolistAPI.createTodolist(title)
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(addTodolistAC(res.data.data.item))
			dispatch(setStatusAC('succeeded'))
		} else {
			handleServerAppError<{ item: GetTodolistType }>(res.data, dispatch)
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

export const removeTodolistTC = (todolistID3: string): AppThunkType => async dispatch => {
	dispatch(setStatusAC('loading'))
	dispatch(setEntityStatus(todolistID3, 'loading'))
	try {

		const res = await todolistAPI.deleteTodolist(todolistID3)
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(removeTodolistAC(todolistID3))
			dispatch(setStatusAC('succeeded'))
		}
	} catch (err) {
		if (axios.isAxiosError<ErrorsType>(err)) {
			const messageError = err.response ? err.response.data.message : err.message
			handleServerNetworkError(messageError, dispatch)
			dispatch(setEntityStatus(todolistID3, 'failed'))
		} else {
			const error = (err as Error).message
			console.log(error)
		}
	}
}


export type TodolistReducersType = AddTodolistACType
	| RemoveTodolistAC
	| SetTodoLists
	| setStatusACType
	| SetEntityStatus

export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>

export type SetTodoLists = ReturnType<typeof setTodoLists>
export type SetEntityStatus = ReturnType<typeof setEntityStatus>
