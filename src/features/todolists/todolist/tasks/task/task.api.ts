import { ResponseType, instance } from 'common/api/api'
import { TaskPriorities, TaskStatuses } from 'common/enums/enums.type'

export const taskAPI = {
	getTasks(todolistID: string) {
		return instance.get<getTasksResponseType>(`todo-lists/${todolistID}/tasks`)
	},
	createTask(arg: AddTaskArgType) {
		return instance.post<ResponseType<{ item: GetTaskType }>>(`todo-lists/${arg.todolistID}/tasks`, { title: arg.title })
	},
	updateTask(todolistID: string, taskId: string, model: UpdateTaskModelType) {
		return instance.put<ResponseType<{ item: GetTaskType }>>(`todo-lists/${todolistID}/tasks/${taskId}`, model)
	},
	deleteTask(arg: deleteTaskArgType) {
		return instance.delete<ResponseType<{ item: GetTaskType }>>(`todo-lists/${arg.todolistID}/tasks/${arg.taskID}`)
	},
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


export type UpdateTaskModelType = {
	description: string
	title: string
	status: TaskStatuses
	priority: TaskPriorities
	startDate: string
	deadline: string
}


export type AddTaskArgType = {
	todolistID: string
	title: string
}

export type deleteTaskArgType = {
	todolistID: string
	taskID: string
}

export type createTaskArgType = {
	todolistID: string
	taskId: string
	domainModel: FlexType
}

interface FlexType {
	description?: string
	title?: string
	status?: TaskStatuses
	priority?: TaskPriorities
	startDate?: string
	deadline?: string
}
