import axios from 'axios'

export const instance = axios.create({
	withCredentials: true,
	baseURL: 'https://social-network.samuraijs.com/api/1.1/',
	headers: {
		"API-KEY": '1449fb6f-a118-46bc-8b11-af0716488d9c'
	}
})

type FieldsErrorType = {
	field: string
	error: string
}

export type ResponseType<T = {}> = {
	resultCode: number
	messages: string[],
	data: T,
	fieldsErrors: FieldsErrorType[]
}


export type ErrorsType = {
	field: string
	message: string
}