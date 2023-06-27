import { RequestStatusType, appActions } from "../../app/app.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TodolistDomainType } from "../../app/App";
import { createAppAsyncThunk, handleServerAppError } from "common/utils";
import { thunkTryCatch } from "common/utils/thunk-try-catch";
import { GetTodolistType, todolistAPI } from "./api.todolists";
import { ResultCode } from "common/enums/enums.type";
import { clearTasksAndTodolists } from "common/actions";

const initialState: TodolistDomainType[] = []

const getTodos = createAppAsyncThunk<{ todos: GetTodolistType[] }, void>
	('todolists/getTodos', async (_, thunkAPI) => {
		return thunkTryCatch(thunkAPI, async () => {
			const res = await todolistAPI.getTodolists()
			return { todos: res.data }
		})
	})


const addTodolist = createAppAsyncThunk<any, any>
	('todolists/addTodolist', async (title: string, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			const res = await todolistAPI.createTodolist(title)
			if (res.data.resultCode === ResultCode.OK) {
				return { item: res.data.data.item }
			} else {
				handleServerAppError<{ item: GetTodolistType }>(res.data, dispatch)
				return rejectWithValue(null)
			}
		})
	})

const removeTodolist = createAppAsyncThunk<{ todolistID: string }, { todolistID: string }>
	('todolists/removeTodolist', async (arg, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			dispatch(appActions.setStatus({ status: 'loading' }))
			dispatch(todolistsActions.setEntityStatus({ todolistID: arg.todolistID, entityStatus: 'loading' }))
			const res = await todolistAPI.deleteTodolist(arg.todolistID)
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(todolistsActions.setEntityStatus({ todolistID: arg.todolistID, entityStatus: 'succeeded' }))
				return { todolistID: arg.todolistID }
			} else {
				return rejectWithValue(null)
			}
		})
	})

const slice = createSlice({
	name: "todolists",
	initialState: initialState,
	reducers: {
		setEntityStatus(state, action: PayloadAction<{ todolistID: string, entityStatus: RequestStatusType }>) {
			const index = state.findIndex(el => el.id === action.payload.todolistID)
			state[index].entityStatus = action.payload.entityStatus
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
			.addCase(addTodolist.fulfilled, (state, action) => {
				state.unshift({ ...action.payload.item, filter: 'All', entityStatus: 'idle' })
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
export const todolistsThunks = { getTodos, addTodolist, removeTodolist }