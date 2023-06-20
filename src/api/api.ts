import axios from 'axios'

const instance = axios.create({
	withCredentials: true,
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	headers: {
		"API-KEY": '1449fb6f-a118-46bc-8b11-af0716488d9c'
	}
})

export const todolistAPI = {
	getTodolists() {
		return instance.get<GetTodolistType[]>(`todo-lists`)
	},
	createTodolist(title: string) {
		return instance.post<ResponsType<{ item: GetTodolistType }>>(`todo-lists`, { title })
	},
	updateTodolist(todolistID: string, title: string) {
		return instance.put<ResponsType>(`todo-lists/${todolistID}`, { title })
	},
	deleteTodolist(todolistID: string) {
		return instance.delete<ResponsType>(`todo-lists/${todolistID}`)
	},
	getTasks(todolistID: string) {
		return instance.get<getTasksResponseType>(`todo-lists/${todolistID}/tasks`)
	},
	createTask(todolistID: string, title: string) {
		return instance.post<ResponsType<{ item: GetTaskType }>>(`todo-lists/${todolistID}/tasks`, { title })
	},
	updateTask(todolistID: string, taskId: string, model: UpdateTaskModelType) {
		return instance.put<ResponsType<{ item: GetTaskType }>>(`todo-lists/${todolistID}/tasks/${taskId}`, model)
	},
	deleteTask(todolistID: string, taskId: string) {
		return instance.delete<ResponsType<{ item: GetTaskType }>>(`todo-lists/${todolistID}/tasks/${taskId}`)
	},
}

// export const authAPI = {
// 	login(data: LoginType) {
// 		return instance.post<ResponsType<{ userId: number }>>(`auth/login`, data)
// 	},
// 	me() {
// 		return instance.get<ResponsType<UserType>>(`auth/me`)
// 	}
// }

export enum ResultCode {
	OK = 0,
	ERROR = 1,
	ERROR_CAPTCHA = 10
}

export type UserType = {
	id: number,
	email: string,
	login: string
}

export type LoginType = {
	email: string,
	password: string,
	rememberMe: boolean,
	captcha?: string,
}

export type GetTodolistType = {
	id: string
	title: string
	addedDate: string
	order: number
}

type ResponsType<T = {}> = {
	resultCode: number
	messages: string[],
	data: T
}

export enum TaskStatuses {
	New = 0,
	InProgress = 1,
	Completed = 2,
	Draft = 3
}

export enum TaskPriorities {
	Low = 0,
	Middle = 1,
	Hi = 2,
	Urgently = 3,
	Later = 4
}

export type GetTaskType = {
	description: string
	title: string
	status: TaskStatuses
	priority: TaskPriorities
	startDate: string
	deadline: string
	id: string
	todoListId: string
	order: number
	addedDate: string
}

export type getTasksResponseType = {
	error: string | null
	totalCount: number
	items: GetTaskType[]
}

// type ResponsTaskType<T = {}> = {
// 	resultCode: number
// 	messages: string[]
// 	data: T
// }

export type UpdateTaskModelType = {
	description: string
	title: string
	status: TaskStatuses
	priority: TaskPriorities
	startDate: string
	deadline: string
}
