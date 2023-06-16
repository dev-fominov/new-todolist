import { combineReducers, legacy_createStore, AnyAction, applyMiddleware } from "redux";
import { todolistsReducer } from "./todolists-reducer";
import { tasksReducer } from "./tasks-reducer";
import thunk, { ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";


const rootReducer = combineReducers({
	todolists: todolistsReducer,
	tasks: tasksReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppDispatchType>()
export type AppRootStateType = ReturnType<typeof rootReducer>

// @ts-ignore
window.store = store