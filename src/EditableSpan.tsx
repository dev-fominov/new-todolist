import { ChangeEvent, useState } from "react"

type propsType = {
	oldTitle: string
	callBack: (updateTitle: string) => void
}

export const EditableSpan = (props: propsType) => {

	const [edit, setEdit] = useState<boolean>(false)
	const editFoo = () => {
		setEdit(!edit)
		if (edit) {
			addTaskHandler()
		}
	}

	const [updateTitle, setUpdateTitleTask] = useState<string>(props.oldTitle)
	const [error, setError] = useState<string | null>(null)

	const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setError(null)
		setUpdateTitleTask(event.currentTarget.value)
	}

	const addTaskHandler = () => {
		props.callBack(updateTitle)
	}

	return (
		edit
			? <input onBlur={editFoo} value={updateTitle} autoFocus onChange={onChangeHandler} />
			: <span onDoubleClick={editFoo}>{props.oldTitle}</span>
	)
}