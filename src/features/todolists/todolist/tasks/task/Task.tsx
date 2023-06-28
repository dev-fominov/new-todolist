import { useActions } from "common/hooks"
import { tasksThunks } from "./tasks.slice"
import { EditableSpan } from "common/components"
import { TaskStatuses } from "common/enums/enums.type"
import s from "./styles.module.css"
import { ChangeEvent, FC } from "react"
import { GetTaskType } from "./task.api"

type Props = {
	task: GetTaskType
}

export const Task: FC<Props> = ({task}) => {

	const todolistID = task.todoListId

	const { deleteTask, updateTask } = useActions(tasksThunks)
	const removeTaskHandler = (todolistID: string, taskID: string) => deleteTask({ todolistID, taskID })
	const changeStatusHandler = (todolistID: string, taskId: string, e: ChangeEvent<HTMLInputElement>) => {
		let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
		updateTask({ todolistID, taskId, domainModel: { status } })
	}
	const updateTaskHandler = (taskId: string, title: string) => updateTask({ todolistID, taskId, domainModel: { title } })

	return (
		<>
			<li className={task.status ? s.isDone : ''}>
				<button 
					onClick={() => removeTaskHandler(todolistID, task.id)}>x</button>
				<input
					type="checkbox"
					checked={task.status === TaskStatuses.Completed}
					onChange={(e) => changeStatusHandler(todolistID, task.id, e)} />
				<EditableSpan
					callBack={(updateTitle: string) => updateTaskHandler(task.id, updateTitle)}
					oldTitle={task.title} />
			</li>
		</>
	)
}