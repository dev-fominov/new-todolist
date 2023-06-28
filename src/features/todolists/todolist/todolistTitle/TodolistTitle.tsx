import { FC } from "react"
import { TodolistDomainType } from "common/types"
import { useActions } from "common/hooks"
import { todolistsThunks } from "features/todolists/todolists.slice"
import { EditableSpan } from "common/components"

type Props = {
	todolist: TodolistDomainType
}

export const TodolistTitle: FC<Props> = ({ todolist }) => {

	const todolistID = todolist.id
	const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

	const removeTodolistHandler = () => removeTodolist(todolistID)

	const changeTodolistTitleHandler = (title: string) => {
		changeTodolistTitle({ todolistID, title })
	}

	return (
		<h3>
			<button disabled={todolist.entityStatus === 'loading'} onClick={removeTodolistHandler}>x</button>
			<EditableSpan oldTitle={todolist.title} callBack={(updateTitle: string) => changeTodolistTitleHandler(updateTitle)} />
		</h3>
	)
}