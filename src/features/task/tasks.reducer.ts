import { TaskAssocType } from "../../app/App"
import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "../../app/app.reducer"
import { todolistsThunks } from "../todolistsList/todolists.reducer"
import { createAppAsyncThunk, handleServerAppError } from "common/utils"
import { AddTaskArgType, GetTaskType, UpdateTaskModelType, createTaskArgType, deleteTaskArgType, taskAPI } from "./api.task"
import { ResultCode } from "common/enums/enums.type"
import { clearTasksAndTodolists } from "common/actions"
import { thunkTryCatch } from "common/utils/thunk-try-catch"


const initialState: TaskAssocType = {}

// Типизацияя санки 1) что возвращает. 2) что принимает. 
const getTasks = createAppAsyncThunk<{ todolistID: string, tasks: GetTaskType[] }, string>
	('tasks/getTasks', async (todoID: string, thunkAPI) => {
		return thunkTryCatch(thunkAPI, async () => {
			const res = await taskAPI.getTasks(todoID)
			return { todolistID: todoID, tasks: res.data.items }
		})
	})

const addTask = createAppAsyncThunk<{ task: GetTaskType }, AddTaskArgType>
	('tasks/addTask', async (arg: AddTaskArgType, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			const res = await taskAPI.createTask(arg)
			if (res.data.resultCode === ResultCode.OK) {
				return { task: res.data.data.item }
			} else {
				handleServerAppError<{ item: GetTaskType }>(res.data, dispatch)
				return rejectWithValue(null)
			}
		})
	})

const deleteTask = createAppAsyncThunk<deleteTaskArgType, deleteTaskArgType>
	('tasks/deleteTask', async (arg: deleteTaskArgType, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			const res = await taskAPI.deleteTask(arg)
			if (res.data.resultCode === ResultCode.OK) {
				return arg
			} else {
				handleServerAppError<{ item: GetTaskType }>(res.data, dispatch)
				return rejectWithValue(null)
			}
		})
	})

const updateTask = createAppAsyncThunk<createTaskArgType, createTaskArgType>
	('tasks/updateTask', async (arg, thunkAPI) => {
		const { dispatch, rejectWithValue, getState } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			const task = getState().tasks[arg.todolistID].find(t => t.id === arg.taskId)
			if (!task) {
				console.log('Task not found')
				return rejectWithValue(null)
			}
			const model: UpdateTaskModelType = {
				title: task.title,
				description: task.description,
				priority: task.priority,
				startDate: task.startDate,
				deadline: task.deadline,
				status: task.status,
				...arg.domainModel
			}

			const res = await taskAPI.updateTask(arg.todolistID, arg.taskId, model)
			if (res.data?.resultCode === ResultCode.OK) {
				dispatch(appActions.setStatus({ status: 'succeeded' }))
				return arg
			} else {
				handleServerAppError<{ item: GetTaskType }>(res.data, dispatch)
				return rejectWithValue(null)
			}
		})
	})

const slice = createSlice({
	name: "tasks",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(getTasks.fulfilled, (state, action) => {
				state[action.payload.todolistID] = action.payload.tasks
			})
			.addCase(addTask.fulfilled, (state, action) => {
				state[action.payload.task.todoListId].unshift(action.payload.task)
			})
			.addCase(deleteTask.fulfilled, (state, action) => {
				const tasks = state[action.payload.todolistID]
				const index = tasks.findIndex(el => el.id === action.payload.taskID)
				tasks.splice(index, 1)
			})
			.addCase(updateTask.fulfilled, (state, action) => {
				const tasks = state[action.payload.todolistID]
				const index = tasks.findIndex(el => el.id === action.payload.taskId)
				tasks[index] = { ...tasks[index], ...action.payload.domainModel }
			})
			.addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
				state[action.payload.item.id] = []
			})
			.addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
				delete state[action.payload.todolistID]
			})
			.addCase(todolistsThunks.getTodos.fulfilled, (state, action) => {
				action.payload.todos.forEach((tl) => {
					state[tl.id] = []
				})
			})
			.addCase(clearTasksAndTodolists, () => {
				return {}
			})
	}
})

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { getTasks, addTask, deleteTask, updateTask }