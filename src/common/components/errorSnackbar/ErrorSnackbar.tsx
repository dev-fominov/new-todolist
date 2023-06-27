import { ErrorType, appActions } from "app/app.reducer"
import { useAppDispatch, useAppSelector } from "common/hooks"

export const ErrorSnackbar = () => {

	const dispatch = useAppDispatch()
	const error = useAppSelector<ErrorType>(state => state.app.error)

	const closeHandler = () => {
		dispatch(appActions.setError({ error: null }))
	}

	if (!!error) {
		setTimeout(() => {
			dispatch(appActions.setError({ error: null }))
		}, 5000)
	}

	return (
		<>
			{!!error && <div className="errorSnackbar">
				{error}
				<button onClick={closeHandler}>x</button>
			</div>}
		</>
	)
}