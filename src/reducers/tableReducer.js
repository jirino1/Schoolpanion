const initialState = {
  tableData: null,
  subjects: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_TABLEDATA":
      return {
        ...state,
        tableData: action.payload.tableData,
        subjects: action.payload.subjects
      };
    case "SET_TABLEDATA":
      let newTable = state.tableData;
      let newSubjects = [];
      if (newTable) {
        newTable[action.payload.hour][action.payload.index] =
          action.payload.subject;

        newTable.forEach(hour => {
          hour.forEach(lesson => {
            if (lesson && lesson !== "" && !newSubjects.includes(lesson)) {
              newSubjects.push(lesson);
            }
          });
        });

        if (
          !state.subjects.find(subject => subject === action.payload.subject) &&
          action.payload.subject !== "" &&
          action.payload.subject !== null
        ) {
          newSubjects = state.subjects;
          newSubjects.push(action.payload.subject);
        }
      }

      if (newTable && newSubjects) {
        return { ...state, tableData: newTable, subjects: newSubjects };
      }
      if (newTable) {
        return { ...state, tableData: newTable };
      }
      return state;

    default:
      return state;
  }
};
