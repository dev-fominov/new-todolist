import { RequestStatusType } from "../../app/app.slice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { createAppAsyncThunk } from "common/utils";
import { GetTodolistType, todolistAPI } from "./todolists.api";
import { ResultCode } from "common/enums/enums.type";
import { clearTasksAndTodolists } from "common/actions";
import { FilterType, TodolistDomainType } from "common/types";

const initialState: TodolistDomainType[] = []

const getTodos = createAppAsyncThunk<{ todos: GetTodolistType[] }, void>
	('todolists/getTodos', async () => {
		const res = await todolistAPI.getTodolists()
		return { todos: res.data }
	})


const addTodolist = createAppAsyncThunk<{ todolist: GetTodolistType }, string>
	('todolists/addTodolist', async (title, { rejectWithValue }) => {
		const res = await todolistAPI.createTodolist(title)
		if (res.data.resultCode === ResultCode.OK) {
			return { todolist: res.data.data.item }
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: false })
		}
	})

const removeTodolist = createAppAsyncThunk<{ todolistID: string }, string>
	('todolists/removeTodolist', async (todolistID, { dispatch, rejectWithValue }) => {
		dispatch(todolistsActions.setEntityStatus({ todolistID, entityStatus: 'loading' }))
		const res = await todolistAPI.deleteTodolist(todolistID)
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(todolistsActions.setEntityStatus({ todolistID, entityStatus: 'succeeded' }))
			return { todolistID }
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: true })
		}
	})

const changeTodolistTitle = createAppAsyncThunk<{ todolistID: string, title: string }, { todolistID: string, title: string }>
	('todolists/changeTodolistTitle', async ({ todolistID, title }, {rejectWithValue}) => {
		const res = await todolistAPI.updateTodolist(todolistID, title)
		if (res.data.resultCode === ResultCode.OK) {
			return { todolistID, title }
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: true })
		}
	})

const slice = createSlice({
	name: "todolists",
	initialState: initialState,
	reducers: {
		setEntityStatus(state, action: PayloadAction<{ todolistID: string, entityStatus: RequestStatusType }>) {
			const index = state.findIndex(el => el.id === action.payload.todolistID)
			state[index].entityStatus = action.payload.entityStatus
		},
		changeFilterTasks(state, action: PayloadAction<{ todolistID: string, filter: FilterType }>) {
			const index = state.findIndex(el => el.id === action.payload.todolistID)
			state[index].filter = action.payload.filter
		}
	},
	extraReducers: builder => {
		builder
			.addCase(removeTodolist.fulfilled, (state, action) => {
				const index = state.findIndex(el => el.id === action.payload.todolistID)
				if (index !== -1) {
					state.splice(index, 1)
				}
			})
			.addCase(changeTodolistTitle.fulfilled, (state, action) => {
				const index = state.findIndex(el => el.id === action.payload.todolistID)
				state[index].title = action.payload.title
			})
			.addCase(addTodolist.fulfilled, (state, action) => {
				state.unshift({ ...action.payload.todolist, filter: 'All', entityStatus: 'idle' })
			})
			.addCase(getTodos.fulfilled, (state, action) => {
				return action.payload.todos.map(el => ({ ...el, filter: 'All', entityStatus: 'idle' }))
			})
			.addCase(clearTasksAndTodolists, () => {
				return []
			})
	}
})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { getTodos, addTodolist, removeTodolist, changeTodolistTitle }