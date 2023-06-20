import { Dispatch } from "redux"
import { setErrorAC, setErrorACType, setStatusAC, setStatusACType } from "../reducers/app-reducer"


export const handleServerNetworkError = (error: string, dispatch: Dispatch<ErrorUtilsDispatchType>) => {
	dispatch(setErrorAC(error))
	dispatch(setStatusAC('failed'))
}

type ErrorUtilsDispatchType = setStatusACType | setErrorACType