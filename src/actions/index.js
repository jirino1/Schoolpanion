 //import jsonPlaceholder from '../apis/jsonPlaceholder';
export const getTasks = () => async dispatch => {
  // const response = [{id:1, title:"Checkliste", date:"2020-02-01"}, {id:2, title:"Pupsi", date:"2020-01-31"}];
  const response =[];
   //const response = await jsonPlaceholder.get('/todos');

  dispatch({
    type: 'GET_TASKS',
    payload: response
  });
}

export const deleteTask = id => async dispatch => {
  dispatch({
    type: 'DELETE_TASK',
    payload: id
  })
}
export const getTask = (id) => async dispatch => {
  dispatch({
    type: 'GET_TASK',
    payload: id
  })
}
export const getNextId = () => async dispatch => {
  console.log("hallöle")
  dispatch({
    type: 'GET_NEXT_ID',
    payload: 0
  })
}
export const createTask = (task) => async dispatch => { 
  dispatch({
    type: 'CREATE_TASK',
    payload: task
  })
}
export const markDone = (id) => async dispatch =>{
  dispatch({
    type: 'MARK_DONE',
    payload: id
  })
}

export const editTask = (id, task) => async dispatch => {
  dispatch({
    type: 'EDIT_TASK',
    payload: {id, task}
  })
}
export * from './examActions';
export * from './tableActions';
