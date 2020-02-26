export const getTableData = () => async dispatch => {
    const response = [["", "", "", "", ""], ["", "", "", "", ""],
    ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""],
    ["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""],
    ["", "", "", "", ""], ["", "", "", "", ""],["", "", "", "", ""]]
  
    dispatch({
      type: 'GET_TABLEDATA',
      payload: {tableData: response, subjects:[]}
    });
  }
export const setTableData = (hour, index, subject) => async dispatch => {
    dispatch({
        type: 'SET_TABLEDATA',
        payload:{hour, index, subject}
    })
}