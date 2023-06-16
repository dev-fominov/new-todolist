// import { tasksReducer, addTaskAC, removeTaskAC, changeStatusTaskAC, updateTaskAC } from "./tasks-reducer"
import { TaskAssocType } from "../App"

// describe("taskReducers", () => {
	// let startState: TaskAssocType

	// beforeEach(() => {
		// startState = {
		// 	"todolist1": [
		// 		{ id: "1", title: "HTML&CSS", isDone: true },
		// 		{ id: "2", title: "JS", isDone: false },
		// 		{ id: "3", title: "ReactJS", isDone: false }
		// 	],
		// 	"todolist2": [
		// 		{ id: "1", title: "bread", isDone: true },
		// 		{ id: "2", title: "milk", isDone: false },
		// 		{ id: "3", title: "tea", isDone: false }
		// 	]
		// }
	// })

	// it("correctly removes a task from a todolist", () => {
	// 	const endState = tasksReducer(startState, removeTaskAC("todolist1", "2"))

	// 	expect(endState["todolist1"].length).toBe(2)
	// 	expect(endState["todolist1"].every(task => task.id !== "2")).toBeTruthy()
	// })

	// it("correctly adds a task to a todolist", () => {
	// 	const endState = tasksReducer(startState, addTaskAC("todolist1", "Redux"))

	// 	expect(endState["todolist1"].length).toBe(4)
	// 	expect(endState["todolist1"][0].title).toBe("Redux")
	// 	expect(endState["todolist1"][0].isDone).toBeFalsy()
	// 	expect(endState["todolist1"][0].id).toBeDefined()
	// })

	// it("correctly changes the status of a task", () => {
	// 	const endState = tasksReducer(startState, changeStatusTaskAC("todolist2", "2", true))

	// 	expect(endState["todolist2"].length).toBe(3)
	// 	expect(endState["todolist2"][1].isDone).toBeTruthy()
	// 	expect(endState["todolist2"][1].id).toBe("2")
	// 	expect(endState["todolist2"][1].title).toBe("milk")
	// })

	// it("correctly updates a task's title", () => {
	// 	const endState = tasksReducer(startState, updateTaskAC("todolist1", "2", "JavaScript"))

	// 	expect(endState["todolist1"].length).toBe(3)
	// 	expect(endState["todolist1"][1].title).toBe("JavaScript")
	// 	expect(endState["todolist1"][1].id).toBe("2")
	// 	expect(endState["todolist1"][1].isDone).toBeFalsy()
	// })

// })
