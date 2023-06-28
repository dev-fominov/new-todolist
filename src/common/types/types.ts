import { RequestStatusType } from "app/app.slice"
import { GetTaskType } from "features/todolists/todolist/tasks/task/task.api"
import { GetTodolistType } from "features/todolists/todolists.api"

export type FilterType = 'All' | 'Active' | 'Completed'
export type TodolistDomainType = GetTodolistType & {
	filter: FilterType
	entityStatus: RequestStatusType
}

export type TaskAssocType = {
	[key: string]: GetTaskType[]
}