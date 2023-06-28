import { Dispatch } from "redux"
import { ErrorsType } from "common/api/api"
import { appActions } from "app/app.slice"
import axios, { AxiosError } from "axios"

/**
 * Handles network errors by dispatching error messages.
 *
 * @param {unknown} e - The error object.
 * @param {Dispatch} dispatch - The function to dispatch the error message.
 */
export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
	const err = e as Error | AxiosError<{ error: string }>
	if (axios.isAxiosError<ErrorsType>(err)) {
		const error = err.message ? err.message : 'Some error occurred'
		dispatch(appActions.setError({ error }))
	} else {
		dispatch(appActions.setError({ error: `Native error ${err.message}` }))
	}
}