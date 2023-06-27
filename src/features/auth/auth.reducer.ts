import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "app/app.reducer"
import { handleServerAppError } from "common/utils/handle-server-app-error"
import { createAppAsyncThunk, handleServerNetworkError } from "common/utils"
import { thunkTryCatch } from "common/utils/thunk-try-catch"
import { clearTasksAndTodolists } from "common/actions"
import { LoginType, authAPI } from "./api.auth"
import { ResultCode } from "common/enums/enums.type"

const initialState = { isLoggedIn: false }


const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType>
	('auth/login', async (arg, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			const res = await authAPI.login(arg)
			if (res.data.resultCode === ResultCode.OK) {
				return { isLoggedIn: true }
			} else {
				const isShowError = !res.data.fieldsErrors.length
				handleServerAppError(res.data, dispatch, isShowError)
				return rejectWithValue(res.data)
			}
		})
	})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
	('auth/logout', async (_, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		return thunkTryCatch(thunkAPI, async () => {
			const res = await authAPI.logOut()
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(clearTasksAndTodolists())
				return { isLoggedIn: false }
			} else {
				handleServerAppError(res.data, dispatch)
				return rejectWithValue(null)
			}
		})
	})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
	('app/initializeApp', async (_, thunkAPI) => {
		const { dispatch, rejectWithValue } = thunkAPI
		try {
			dispatch(appActions.setStatus({ status: 'loading' }))
			const res = await authAPI.me()
			if (res.data.resultCode === ResultCode.OK) {
				dispatch(appActions.setStatus({ status: 'succeeded' }))
				return { isLoggedIn: true }
			} else {
				return rejectWithValue(null)
			}
		} catch (err) {
			handleServerNetworkError(err, dispatch)
			return rejectWithValue(null)
		} finally {
			dispatch(appActions.setIsInitialized({ isInitialized: true }))
		}
	})



const slice = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
			.addCase(logout.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
			.addCase(initializeApp.fulfilled, (state, action) => {
				state.isLoggedIn = action.payload.isLoggedIn
			})
	}
})

export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = { login, logout, initializeApp }