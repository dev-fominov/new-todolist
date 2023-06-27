import { ResponseType, instance } from 'common/api/api'

export const todolistAPI = {
	getTodolists() {
		return instance.get<GetTodolistType[]>(`todo-lists`)
	},
	createTodolist(title: string) {
		return instance.post<ResponseType<{ item: GetTodolistType }>>(`todo-lists`, { title })
	},
	updateTodolist(todolistID: string, title: string) {
		return instance.put<ResponseType>(`todo-lists/${todolistID}`, { title })
	},
	deleteTodolist(todolistID: string) {
		return instance.delete<ResponseType>(`todo-lists/${todolistID}`)
	}
}

export type GetTodolistType = {
	id: string
	title: string
	addedDate: string
	order: number
}