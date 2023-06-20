import { combineReducers, legacy_createStore, AnyAction, applyMiddleware } from "redux";
import { todolistsReducer } from "./todolists-reducer";
import { tasksReducer } from "./tasks-reducer";
import thunk, { ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { appReducer } from "./app-reducer";
import { useSelector } from "react-redux";


const rootReducer = combineReducers({
	todolists: todolistsReducer,
	tasks: tasksReducer,
	app: appReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export type AppRootStateType = ReturnType<typeof rootReducer>

export const useAppDispatch = () => useDispatch<AppDispatchType>()
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

// @ts-ignore
window.store = store