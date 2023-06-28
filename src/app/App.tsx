import './App.css';
import { useEffect } from 'react';
import { RequestStatusType } from './app.slice';
import { TodolistsList } from '../features/todolists/TodolistsList';
import { Login } from '../features/auth/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorSnackbar } from 'common/components';
import { authThunks } from 'features/auth/auth.slice';
import { useActions, useAppSelector } from 'common/hooks';


export const App = () => {

	const { logout, initializeApp } = useActions(authThunks)
	let status = useAppSelector<RequestStatusType>(state => state.app.status)
	let isInitialized = useAppSelector<boolean>(state => state.app.isInitialized)
	let isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	const logOut = () => logout({})

	useEffect(() => { initializeApp({}) }, [])

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