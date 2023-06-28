import { ResponseType } from "common/api/api"
import { appActions } from "app/app.slice"
import { Dispatch } from "redux"

/**
 * Handles server errors by dispatching error messages and setting status to idle.
 *
 * @param {ResponseType<T>} data - The response data from the server.
 * @param {Dispatch} dispatch - The function to dispatch the error message and set the status.
 * @param {boolean} [showError=true] - Optional parameter to indicate whether to show the error message or not.
 */
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch, showError: boolean = true) => {
	if (showError) {
		dispatch(appActions.setError({ error: data.messages.length ? data.messages[0] : 'Some error' }))
	}

	dispatch(appActions.setStatus({ status: 'idle' }))

}