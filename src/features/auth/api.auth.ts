import { ResponseType, instance } from 'common/api/api'

export const authAPI = {
	login(data: LoginType) {
		return instance.post<ResponseType<{ userId: number }>>(`auth/login`, data)
	},
	me() {
		return instance.get<ResponseType<UserType>>(`auth/me`)
	},
	logOut() {
		return instance.delete<ResponseType>(`auth/login`)
	}
}

export type LoginType = {
	email: string,
	password: string,
	rememberMe: boolean,
	captcha?: string,
}

export type UserType = {
	id: number,
	email: string,
	login: string
}