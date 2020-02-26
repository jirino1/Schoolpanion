export const getExams = () => async dispatch => {
    // const response = [{id:1, subject:"Mathe", date:"2020-02-20", tasks:[1, 2]}];
    const response = []
     //const response = await jsonPlaceholder.get('/todos');
  
    dispatch({
      type: 'GET_EXAMS',
      payload: response
    });
  }
export const deleteExam = id => async dispatch => {
    dispatch({
      type: 'DELETE_EXAM',
      payload: id
    })
  }
  export const deleteTaskOfExam = (examID,taskID) => async dispatch => {
    dispatch({
      type: 'DELETE_TASK_OF_EXAM',
      payload: {taskID, examID}
    })
  }
  export const getNextExamId = () => async dispatch => {
    dispatch({
      type: 'GET_NEXT_EXAMID',
      payload: 0
    })
  }
export const getExam = (id) => async dispatch => {
    dispatch({
      type: 'GET_EXAM',
      payload: id
    })
  }
  export const createExam = (exam) => async dispatch => {
    dispatch({
      type: 'CREATE_EXAM',
      payload: exam
    })
  }
  export const editExam = (id, exam) => async dispatch => {
    console.log({id, exam})
    dispatch({
      type: 'EDIT_EXAM',
      payload: {id, exam}
    })
  }