import axios from "axios"
import { LoginType, ResultCode, authAPI } from "../../api/api"
import { setErrorACType, setIsInitializedAC, setStatusAC, setStatusACType } from "../../reducers/app-reducer"
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils"
import { ErrorsType } from "../../reducers/tasks-reducer"
import { AppThunkType } from "../../reducers/store"

const initialState = {
	isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: AuthActionsType): InitialStateType => {
	switch (action.type) {
		case 'login/SET-IS-LOGGED-IN':
			return { ...state, isLoggedIn: action.value }
		default:
			return state
	}
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
	({ type: 'login/SET-IS-LOGGED-IN', value } as const)

// thunks
export const loginTC = (data: LoginType): AppThunkType => async dispatch => {
	dispatch(setStatusAC('loading'))
	try {
		const res = await authAPI.login(data)
		console.log(res)
		if (res.data.resultCode === 0) {
			dispatch(setIsLoggedInAC(true))
			dispatch(setStatusAC('succeeded'))
		} else {
			handleServerAppError(res.data, dispatch)
		}
	} catch (err) {
		if (axios.isAxiosError<ErrorsType>(err)) {
			const messageError = err.response ? err.response.data.message : err.message
			handleServerNetworkError(messageError, dispatch)
		} else {
			const error = (err as Error).message
		}
	}

}

export const meTC = (): AppThunkType => async dispatch => {
	dispatch(setStatusAC('loading'))
	try {
		const res = await authAPI.me()
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(setIsLoggedInAC(true))
			dispatch(setStatusAC('succeeded'))
		} else {
			handleServerAppError(res.data, dispatch)
		}
	} catch (err) {
		if (axios.isAxiosError<ErrorsType>(err)) {
			const messageError = err.response ? err.response.data.message : err.message
			handleServerNetworkError(messageError, dispatch)
		} else {
			const error = (err as Error).message
		}
	} finally {
		dispatch(setIsInitializedAC(true))
	}
}

export const logOutTC = (): AppThunkType => async dispatch => {
	dispatch(setStatusAC('loading'))
	try {
		const res = await authAPI.logOut()
		if (res.data.resultCode === ResultCode.OK) {
			dispatch(setIsLoggedInAC(false))
			dispatch(setStatusAC('succeeded'))
		} else {
			handleServerAppError(res.data, dispatch)
		}
	} catch (err) {
		if (axios.isAxiosError<ErrorsType>(err)) {
			const messageError = err.response ? err.response.data.message : err.message
			handleServerNetworkError(messageError, dispatch)
		} else {
			const error = (err as Error).message
		}
	}
}

// types
export type AuthActionsType = ReturnType<typeof setIsLoggedInAC> | setStatusACType | setErrorACType
