import { ChangeEvent, KeyboardEvent, memo, useState } from "react"
import s from "./Todolist.module.css"

type AddItemFormsType = {
	callBack: (title: string) => void
}

export const AddItemForm = memo((props: AddItemFormsType) => {

	const [titleTask, setTitleTask] = useState<string>('')
	const [error, setError] = useState<string | null>(null)

	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setError(null)
		setTitleTask(event.currentTarget.value)
	}

	const addTaskHandler = () => {
		if (titleTask.trim()?.length) {
			props.callBack(titleTask.trim())
			setTitleTask('')
		} else {
			setError('Title is required')
		}

	}

	const onKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {

		if (event.key === 'Enter') {
			if (titleTask.trim()?.length) {
				props.callBack(titleTask.trim())
				setTitleTask('')
			} else {
				setError('Title is required')
			}
		}
	}

	return (
		<>
			<div>
				<input className={error ? s.error : ''} onKeyDown={onKeyDownHandler} value={titleTask} onChange={onChangeHandler} />
				<button onClick={addTaskHandler}>+</button>
			</div>
			{error?.length && <div className={s.errorMessage}>{error}</div>}
		</>
	)
}, (prevProps: Readonly<AddItemFormsType>, nextProps: Readonly<AddItemFormsType>) => {
	return prevProps.callBack !== nextProps.callBack
})