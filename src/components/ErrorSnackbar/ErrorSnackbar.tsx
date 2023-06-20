import { useSelector } from "react-redux"
import { ErrorType, setErrorAC } from "../../reducers/app-reducer"
import { AppRootStateType, useAppDispatch, useAppSelector } from "../../reducers/store"



export const ErrorSnackbar = () => {

	const dispatch = useAppDispatch()
	const error = useAppSelector<ErrorType>(state => state.app.error)

	const closeHandler = () => {
		dispatch(setErrorAC(null))
	}

	if (!!error) {
		setTimeout(() => {
			dispatch(setErrorAC(null))
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