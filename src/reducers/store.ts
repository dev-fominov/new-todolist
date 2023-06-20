import { combineReducers, legacy_createStore, AnyAction, applyMiddleware } from "redux";
import { TodolistReducersType, todolistsReducer } from "./todolists-reducer";
import { TaskReducersType, tasksReducer } from "./tasks-reducer";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { AppActionsType, appReducer } from "./app-reducer";
import { useSelector } from "react-redux";
import { AuthActionsType, authReducer } from "../components/Login/auth-reducer";


const rootReducer = combineReducers({
	todolists: todolistsReducer,
	tasks: tasksReducer,
	app: appReducer,
	auth: authReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppRootDispatchType = ThunkDispatch<AppRootStateType, any, AppRootActionsType>
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppRootActionsType = AuthActionsType
	| TaskReducersType
	| TodolistReducersType
	| AppActionsType

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionsType>

export const useAppDispatch = () => useDispatch<AppRootDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store