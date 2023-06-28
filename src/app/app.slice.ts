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
	},
	extraReducers: builder => {
		builder
			.addMatcher(
				(action) => {
					return action.type.endsWith('/pending')
				},
				(state) => {
					state.status = 'loading'
				})
			.addMatcher(
				(action) => {
					return action.type.endsWith('/rejected')
				},
				(state, action) => {

					const { payload, error } = action

					if (payload) {
						if (payload.showGlobalError) {
							state.error = action.payload.messages.length ? action.payload.messages[0] : 'Some error'
						}

					} else {
						state.error = action.error.message ? action.error.message : 'Some error'
					}

					state.status = 'failed'
				})
			.addMatcher(
				(action) => {
					return action.type.endsWith('/fulfilled')
				},
				(state) => {
					state.status = 'succeeded'
				})
	}
})

export const appReducer = slice.reducer
export const appActions = slice.actions