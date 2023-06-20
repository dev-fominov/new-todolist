import { Dispatch } from "redux"
import { setErrorAC, setErrorACType, setStatusAC, setStatusACType } from "../reducers/app-reducer"
import { ResponseType } from "../api/api"


export const handleServerNetworkError = (error: string, dispatch: Dispatch<ErrorUtilsDispatchType>) => {
	dispatch(setErrorAC(error))
	dispatch(setStatusAC('failed'))
}

export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<ErrorUtilsDispatchType>) => {
	if (data.messages.length) {
		dispatch(setErrorAC(data.messages[0]))
	} else {
		dispatch(setErrorAC('Some error'))
	}
	dispatch(setStatusAC('idle'))
}

type ErrorUtilsDispatchType = setStatusACType | setErrorACType