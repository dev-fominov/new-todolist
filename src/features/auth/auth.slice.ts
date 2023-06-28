import { createSlice } from "@reduxjs/toolkit"
import { appActions } from "app/app.slice"
import { createAppAsyncThunk } from "common/utils"
import { clearTasksAndTodolists } from "common/actions"
import { LoginType, authAPI } from "./auth.api"
import { ResultCode } from "common/enums/enums.type"

const initialState = { isLoggedIn: false }


const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginType>
	('auth/login', async (arg, {rejectWithValue}) => {
		const res = await authAPI.login(arg)
		if (res.data.resultCode === ResultCode.OK) {
			return { isLoggedIn: true }
		} else {
			const isShowError = !res.data.fieldsErrors.length
			return rejectWithValue({ data: res.data, showGlobalError: isShowError })
		}
	})

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
	('auth/logout', async (_, { dispatch, rejectWithValue }) => {
		const res = await authAPI.logOut()
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(clearTasksAndTodolists())
			return { isLoggedIn: false }
		} else {
			return rejectWithValue({ data: res.data, showGlobalError: true })
		}
	})

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>
	('app/initializeApp', async (_, { dispatch, rejectWithValue }) => {
		try {
			const res = await authAPI.me()
			if (res.data.resultCode === ResultCode.OK) {
				return { isLoggedIn: true }
			} else {
				return rejectWithValue({ data: res.data, showGlobalError: false })
			}
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