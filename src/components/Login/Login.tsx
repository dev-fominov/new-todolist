import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "../../reducers/store"
import { loginTC } from "./auth-reducer"
import { Navigate } from "react-router-dom"


type FormikErrorType = {
	email?: string
	password?: string
	rememberMe?: boolean
}

export const Login = () => {

	const dispatch = useAppDispatch()
	const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

	console.log(isLoggedIn)


	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
		validate: values => {

			const errors: FormikErrorType = {}
			if (!values.email) {
				errors.email = 'Required'
			}
			if (!values.password) {
				errors.password = 'Required'
			} else if (values.password?.trim()?.length < 3) {
				errors.password = 'Password must be at least 3 characters'
			}
			return errors
		},
		onSubmit: values => {
			dispatch(loginTC(values))
			formik.resetForm()
		}
	})


	if(isLoggedIn) {
		return <Navigate to={'/'} />
	}

	return (
		<div>
			<p>Чтобы войти в систему, пройдите регистрацию
				<a href={'https://social-network.samuraijs.com/'}
					target={'_blank'}> здесь
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