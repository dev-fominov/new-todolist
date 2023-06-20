import './App.css';
import { getTodos } from './reducers/todolists-reducer';
import { useAppDispatch, useAppSelector } from './reducers/store';
import { useEffect } from 'react';
import { GetTaskType, GetTodolistType } from './api/api';
import { RequestStatusType } from './reducers/app-reducer';
import { ErrorSnackbar } from './components/ErrorSnackbar/ErrorSnackbar';
import { TodolistsList } from './components/Todolists/TodolistsList';
import { Login } from './components/Login/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import { logOutTC, meTC } from './components/Login/auth-reducer';


export type FilterType = 'All' | 'Active' | 'Completed'
export type TodolistDomainType = GetTodolistType & {
	filter: FilterType
	entityStatus: RequestStatusType
}

export type TaskAssocType = {
	[key: string]: GetTaskType[]
}

export const App = () => {

	const dispatch = useAppDispatch()
	let status = useAppSelector<RequestStatusType>(state => state.app.status)
	let isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
	let isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	const logOut = () => {
		dispatch(logOutTC())
	}

	useEffect(() => {
		dispatch(meTC())
	}, [])

	if (!isInitialized) {
		return <div className='app-loading'>Loading...</div>
	}


	return (
		<>
			{status === 'loading' && <div className='app-loading'>Loading...</div>}
			<div className="App">
				<div className="appMenu">
					{isLoggedIn && <button onClick={logOut}>Log out</button>}
				</div>
				<Routes>
					<Route path={'/'} element={<TodolistsList />} />
					<Route path={'/login'} element={<Login />} />
					<Route path={'/404'} element={<h1>404: Page not found.</h1>} />
					<Route path='*' element={<Navigate to={'/404'} />} />
				</Routes>
			</div>
			<ErrorSnackbar />
		</>

	);
}