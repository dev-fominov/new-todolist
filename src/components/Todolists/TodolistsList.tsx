import { AddItemForm } from "../../AddItemForm"
import { TodolistDomainType } from "../../App"
import { TodolistRedux } from "../../TodolistRedux"
import { useAppDispatch, useAppSelector } from "../../reducers/store"
import { addTodolistTC, getTodos } from "../../reducers/todolists-reducer"
import { Navigate } from "react-router-dom"
import { useEffect } from 'react';


export const TodolistsList = () => {


	let todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
	const dispatch = useAppDispatch()
	const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	useEffect(() => {
		if (!isLoggedIn) return
		dispatch(getTodos())
	}, [])


	const addTodolist = (title: string) => {
		dispatch(addTodolistTC(title))
	}

	if (!isLoggedIn) {
		return <Navigate to={'/login'} />
	}

	return (
		<>
			<AddItemForm callBack={addTodolist} />
			<div className="contantTodolists">
				{
					todolists.map((el) => {
						return (
							<TodolistRedux
								key={el.id}
								todolistID={el.id}
								title={el.title}
								filter={el.filter}
								entityStatus={el.entityStatus}
							/>
						)
					})
				}
			</div>
		</>
	)
}