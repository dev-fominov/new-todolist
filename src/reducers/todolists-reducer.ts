import { TodolistDomainType } from "../App";
import { GetTodolistType, ResultCode, todolistAPI } from "../api/api";
import { handleServerNetworkError } from "../utils/error-utils";
import { RequestStatusType, setErrorAC, setStatusAC, setStatusACType } from "./app-reducer";

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

export type TodolistReducersType = AddTodolistACType
	| RemoveTodolistAC
	| SetTodoLists
	| setStatusACType
	| SetEntityStatus

export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>

export type SetTodoLists = ReturnType<typeof setTodoLists>
export const setTodoLists = (todos: GetTodolistType[]) => ({
	type: 'SET-TODOLISTS',
	payload: { todos }
} as const)

export type SetEntityStatus = ReturnType<typeof setEntityStatus>
export const setEntityStatus = (todolistID: string, entityStatus: RequestStatusType) => ({
	type: 'SET-ENTITY-STATUS',
	payload: { todolistID, entityStatus }
} as const)

export const getTodos = () => (dispatch: any) => {
	dispatch(setStatusAC('loading'))
	todolistAPI.getTodolists()
		.then((res) => {
			dispatch(setTodoLists(res.data))
			dispatch(setStatusAC('succeeded'))
		})
		.catch((err) => {
			handleServerNetworkError(err.message, dispatch)
		})
}

export const addTodolistTC = (title: string) => (dispatch: any) => {
	dispatch(setStatusAC('loading'))
	todolistAPI.createTodolist(title)
		.then((res) => {
			if (res.data.resultCode === 0) {
				dispatch(addTodolistAC(res.data.data.item))
				dispatch(setStatusAC('succeeded'))
			}
		})
		.catch((err) => {
			handleServerNetworkError(err.message, dispatch)
		})

}

export const removeTodolistTC = (todolistID3: string) => (dispatch: any) => {
	dispatch(setStatusAC('loading'))
	dispatch(setEntityStatus(todolistID3, 'loading'))
	todolistAPI.deleteTodolist(todolistID3)
		.then((res) => {
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(removeTodolistAC(todolistID3))
				dispatch(setStatusAC('succeeded'))
			}
		})
		.catch((err) => {
			console.log(err)
			dispatch(setStatusAC('failed'))
			dispatch(setEntityStatus(todolistID3, 'failed'))
			dispatch(setErrorAC(err.message))
		})
}


