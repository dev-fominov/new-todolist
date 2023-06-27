import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type ErrorType = null | string

const initialState = {
	status: 'idle' as RequestStatusType,
	error: null as ErrorType,
	isInitialized: false
}

const slice = createSlice({
	name: "app",
	initialState,
	reducers: {
		setStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
			state.status = action.payload.status
		},
		setError(state, action: PayloadAction<{ error: ErrorType }>) {
			state.error = action.payload.error
		},
		setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
			state.isInitialized = action.payload.isInitialized
		}
	}
})

export const appReducer = slice.reducer
export const appActions = slice.actions