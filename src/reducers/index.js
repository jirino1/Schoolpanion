import { combineReducers } from 'redux';

import tasksReducer from './tasksReducer';
import examsReducer from './examsReducer';
import tableReducer from './tableReducer';

export default combineReducers({ tasks: tasksReducer, exams: examsReducer, table: tableReducer});
