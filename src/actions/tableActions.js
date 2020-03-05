export const getTableData = () => async dispatch => {
  const response = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
  ];
  const times = [
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null },
    { time1: null, time2: null }
  ];

  dispatch({
    type: "GET_TABLEDATA",
    payload: { tableData: response, subjects: [], times }
  });
};
export const setTableData = (hour, index, subject) => async dispatch => {
  dispatch({
    type: "SET_TABLEDATA",
    payload: { hour, index, subject }
  });
};
export const setTimes = (hour, time) => async dispatch => {
  dispatch({
    type: "SET_TIMES",
    payload: { hour, time }
  });
};
