const initialState = {
  list: null,
  exam: null,
  nextID: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_EXAMS":
      return { ...state, list: action.payload };
    case "GET_NEXT_EXAMID":
      let idNew = 0;
      if (state.list !== null) {
        for (let i = 0; i < state.list.length; i++) {
          if (idNew < state.list[i].id) {
            idNew = state.list[i].id;
          }
        }
      }
      return { ...state, nextID: idNew + 1 };
    case "DELETE_TASK_OF_EXAM":
      console.log("okidoki");
      let exam3 = state.list.find(
        e => e.id === Number.parseInt(action.payload.examID)
      );
      console.log("exam", exam3);
      let newTasks = [];
      for (let i = 0; i < exam3.tasks.length; i++) {
        if (exam3.tasks[i] !== Number.parseInt(action.payload.taskID)) {
          newTasks.push(exam3.tasks[i]);
        }
      }
      exam3.tasks = newTasks;
      console.log("examV2", exam3);
      let newList3 = state.list;
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].id === Number.parseInt(action.payload.examID)) {
          newList3[i] = exam3;
        }
      }
      return { ...state, list: newList3 };
    case "GET_EXAM":
      const id = parseInt(action.payload);
      const exam = state.list.find(t => t.id === id);
      return { ...state, exam };
    case "CREATE_EXAM":
      let idNew2 = 0;
      for (let i = 0; i < state.list.length; i++) {
        if (idNew2 < state.list[i].id) {
          idNew2 = state.list[i].id;
        }
      }
      const newExam = { id: idNew2 + 1, ...action.payload };
      let newList = state.list;
      newList.push(newExam);
      return { ...state, list: newList };
    case "DELETE_EXAM":
      let newList2 = [];
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].id !== Number.parseInt(action.payload)) {
          newList2.push(state.list[i]);
        }
      }
      return { ...state, list: newList2 };
    case "EDIT_EXAM":
      const id3 = Number.parseInt(action.payload.id);
      const exam2 = state.list.find(t => t.id === id3);
      exam2.tasks = action.payload.exam.tasks;
      exam2.subject = action.payload.exam.subject;
      exam2.date = action.payload.exam.date;
      return { ...state, exam: exam2 };

    default:
      return state;
  }
};
