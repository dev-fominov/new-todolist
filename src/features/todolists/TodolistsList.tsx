import { Todolist } from "./Todolist"
import { todolistsThunks } from "./todolists.slice"
import { Navigate } from "react-router-dom"
import { useEffect } from 'react';
import { AddItemForm } from "common/components"
import { useActions, useAppSelector } from "common/hooks";
import { TodolistDomainType } from "common/types/types";


export const TodolistsList = () => {

	let todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
	const { getTodos, addTodolist } = useActions(todolistsThunks)
	const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	useEffect(() => {
		if (!isLoggedIn) return
		getTodos({})
	}, [])

	const addTodolistHandler = (title: string) => {
		return addTodolist(title).unwrap()
	}

	if (!isLoggedIn) {
		return <Navigate to={'/login'} />
	}

	return (
		<>
			<AddItemForm callBack={addTodolistHandler} />
			<div className="contantTodolists">
				{
					todolists.map(todolist => <Todolist key={todolist.id} todolist={todolist} />)
				}
			</div>
		</>
	)
}