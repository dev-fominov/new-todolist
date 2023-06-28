import { ChangeEvent, KeyboardEvent, memo, useState, FC } from "react"
import s from "../../../features/todolists/Todolist.module.css"

type Props = {
	callBack: (title: string) => Promise<any>
}

export const AddItemForm: FC<Props> = memo(({ callBack }) => {

	const [titleTask, setTitleTask] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setError(null)
		setTitleTask(event.currentTarget.value)
	}

	const addTaskHandler = () => {
		if (titleTask.trim()?.length) {
			callBack(titleTask.trim())
				.then(() => setTitleTask(''))
				.catch(err => {
					if(err.data) {
						const message = err.data.messages.length ? err.data.messages[0] : 'Some error'
						setError(message)
					}
				})
		} else {
			setError('Title is required')
		}

	}

	const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {

		if (event.key === 'Enter') {
			if (titleTask.trim()?.length) {
				callBack(titleTask.trim())
				setTitleTask('')
			} else {
				setError('Title is required')
			}
		}
	}

	return (
		<div>
			<div>
				<input className={error ? s.error : ''} onKeyDown={onKeyDownHandler} value={titleTask} onChange={onChangeHandler} />
				<button onClick={addTaskHandler}>+</button>
			</div>
			{error?.length && <div className={s.errorMessage}>{error}</div>}
		</div>
	)
}, (prevProps: Readonly<Props>, nextProps: Readonly<Props>) => {
	return prevProps.callBack !== nextProps.callBack
})