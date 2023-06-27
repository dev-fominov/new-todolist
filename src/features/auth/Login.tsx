import { FormikHelpers, useFormik } from "formik"
import { Navigate } from "react-router-dom"
import { authThunks } from "./auth.reducer"
import { ResponseType } from "common/api/api"
import { useActions, useAppDispatch, useAppSelector } from "common/hooks"
import { LoginType } from "./api.auth"


type FormikErrorType = {
	email?: string
	password?: string
	rememberMe?: boolean
	captcha?: string
}

export const Login = () => {

	const {login} = useActions(authThunks)
	const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	const formik = useFormik({
		validate: values => {

			// const errors: FormikErrorType = {}
			// if (!values.email) {
			// 	errors.email = 'Required'
			// }
			// if (!values.password) {
			// 	errors.password = 'Required'
			// } else if (values.password?.trim()?.length < 3) {
			// 	errors.password = 'Password must be at least 3 characters'
			// }
			// return errors
		},
		initialValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
		onSubmit: (values, formikHelpers: FormikHelpers<LoginType>) => {
			login(values).unwrap()
				.catch((reason: ResponseType) => {
					const { fieldsErrors } = reason
					if (fieldsErrors) {
						reason.fieldsErrors.forEach(fieldError => {
							formikHelpers.setFieldError(fieldError.field, fieldError.error)
						})
					}
				})
		}
	})


	if (isLoggedIn) {
		return <Navigate to={'/'} />
	}

	return (
		<div>
			<p>Чтобы войти в систему, пройдите регистрацию
				<a href={'https://social-network.samuraijs.com/'}
					target='_blank' rel="noreferrer"> здесь
				</a>
			</p>
			<p>or use common test account credentials:</p>
			<p>Email: free@samuraijs.com</p>
			<p>Password: free</p>

			<form className="formBlock" onSubmit={formik.handleSubmit}>
				<div className="block">
					<input {...formik.getFieldProps('email')} />
					{formik.touched.email && formik.errors.email && <div className="error-form">{formik.errors.email}</div>}
				</div>
				<div className="block">
					<input {...formik.getFieldProps('password')} />
					{formik.touched.password && formik.errors.password && <div className="error-form">{formik.errors.password}</div>}
				</div>
				<div className="block">
					<input type="checkbox" checked={formik.values.rememberMe} {...formik.getFieldProps('rememberMe')} />
				</div>

				<button>send</button>
			</form>
		</div>
	)
}