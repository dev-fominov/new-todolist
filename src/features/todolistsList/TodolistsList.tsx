import { TodolistDomainType } from "../../app/App"
import { TodolistRedux } from "./TodolistRedux"
import { todolistsThunks } from "./todolists.reducer"
import { Navigate } from "react-router-dom"
import { useEffect } from 'react';
import { AddItemForm } from "common/components"
import { useActions, useAppSelector } from "common/hooks";


export const TodolistsList = () => {

	let todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
	const { getTodos, addTodolist } = useActions(todolistsThunks)
	const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	useEffect(() => {
		if (!isLoggedIn) return
		getTodos()
	}, [])

	const addTodolistHandler = (title: string) => addTodolist(title)

	if (!isLoggedIn) {
		return <Navigate to={'/login'} />
	}

	return (
		<>
			<AddItemForm callBack={addTodolistHandler} />
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