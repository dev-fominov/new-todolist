import { v1 } from "uuid";
import { TodolistsType } from "../App";
import { GetTodolistType, todolistAPI } from "../api/api";

const initialState: Array<TodolistsType> = []

export const todolistsReducer = (state = initialState, action: TodolistReducersType): TodolistsType[] => {
	switch (action.type) {
		case "ADD-TODOLIST": {
			return [{ ...action.payload.item, filter: 'All' }, ...state]
		}
		case "REMOVE-TODOLIST": {
			return state.filter(el => el.id !== action.payload.todolistID3)
		}
		case "SET-TODOLISTS": {
			return action.payload.todos.map((tl) => ({ ...tl, filter: 'All' }))
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

export type AddTodolistACType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistAC = ReturnType<typeof removeTodolistAC>

export type SetTodoLists = ReturnType<typeof setTodoLists>
export const setTodoLists = (todos: GetTodolistType[]) => ({
	type: 'SET-TODOLISTS',
	payload: { todos }
} as const)

export const getTodos = () => (dispatch: any) => {
	todolistAPI.getTodolists().then((res) => {
		dispatch(setTodoLists(res.data))
	})
}

export const addTodolistTC = (title: string) => (dispatch: any) => {
	todolistAPI.createTodolist(title).then((res) => {
		if (res.data.resultCode === 0) {
			dispatch(addTodolistAC(res.data.data.item))
		}
	})
}

export const removeTodolistTC = (todolistID3: string) => (dispatch: any) => {
	todolistAPI.deleteTodolist(todolistID3).then((res) => {
		if (res.data.resultCode === 0) {
			dispatch(removeTodolistAC(todolistID3))
		}
	})
}