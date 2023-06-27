import { combineReducers } from "redux";
import { todolistsReducer } from "../features/todolistsList/todolists.reducer";
import { tasksReducer } from "../features/task/tasks.reducer";
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { TypedUseSelectorHook, useDispatch } from "react-redux";
import { appReducer } from "./app.reducer";
import { useSelector } from "react-redux";
import { authReducer } from "../features/auth/auth.reducer";
import { configureStore } from "@reduxjs/toolkit";


const rootReducer = combineReducers({
	todolists: todolistsReducer,
	tasks: tasksReducer,
	app: appReducer,
	auth: authReducer
})

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})

export type AppRootDispatchType = ThunkDispatch<AppRootStateType, any, AppRootActionsType>
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppRootActionsType = any





// @ts-ignore
window.store = store