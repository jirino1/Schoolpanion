const initialState = {
  list: null,
  task: null,
  nextID: null,
  position: 0,
  tasksperpage: 20
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_TASKS":
      return { ...state, list: action.payload };
    case "GET_NEXT_ID":
      let idNew = 0;
      for (let i = 0; i < state.list.length; i++) {
        if (idNew < state.list[i].id) {
          idNew = state.list[i].id;
        }
      }
      return { ...state, nextID: idNew };
    case "GET_TASK":
      const id = parseInt(action.payload);
      const task = state.list.find(t => t.id === id);
      return { ...state, task: task };
    case "MARK_DONE":
      const id2 = Number.parseInt(action.payload);
      const task2 = state.list.find(t => t.id === id2);
      if (task2.completed) {
        task2.completed = false;
      } else {
        task2.completed = true;
      }
      return { ...state, task: task2 };
    case "CREATE_TASK":
      let idNew2 = 0;
      for (let i = 0; i < state.list.length; i++) {
        if (idNew2 < state.list[i].id) {
          idNew2 = state.list[i].id;
        }
      }
      const newTask = { id: idNew2 + 1, ...action.payload };
      let newList = state.list;
      newList.push(newTask);
      return { ...state, list: newList };
    case "DELETE_TASK":
      let newList2 = [];
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].id !== parseInt(action.payload)) {
          newList2.push(state.list[i]);
        }
      }
      return { ...state, list: newList2 };
    case "EDIT_TASK":
      let newList3 = state.list;
      const id3 = Number.parseInt(action.payload.id);
      const task3 = state.list.find(t => t.id === id3);
      task3.title = action.payload.task.title;
      task3.subject = action.payload.task.subject;
      task3.date = action.payload.task.date;
      task3.description = action.payload.task.description;
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].id === id3) {
          newList3[i] = task3;
        }
      }
      return { ...state, list: newList3 };

    default:
      return state;
  }
};
