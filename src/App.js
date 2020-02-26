import React from "react";
import "./App.css";
import { Router, Route } from "react-router-dom";
import Homework from "./components/homeworks/Homework";
import EditHomework from "./components/homeworks/EditHomework";
import CreateHomeworkForm from "./components/homeworks/CreateHomeworkForm";
import MainPage from "./components/MainPage";
import ExamList from "./components/exams/ExamList";
import Exam from "./components/exams/Exam";
import CreateExamForm from "./components/exams/CreateExamForm";
import HomeworkList from "./components/homeworks/HomeworkList";
import EditExamForm from "./components/exams/EditExamForm";
import Table from "./components/timetable/Table";
import Dropzone from "./components/dropzone/Dropzone";
import history from "./history";
import MyMenuBar from "./components/MyMenuBar";

function App() {
  return (
    <div className="App">
      <MyMenuBar />
      <Router history={history}>
        <Route path="/" exact component={MainPage} />
        <Route path="/homework" exact component={HomeworkList} />
        <Route path="/homework/homework/:id" exact component={Homework} />
        <Route path="/homework/homework/:id/edit" component={EditHomework} />
        <Route path="/homework/newHomework" component={CreateHomeworkForm} />
        <Route path="/exams" exact component={ExamList} />
        <Route path="/exams/exam/:id" exact component={Exam} />
        <Route path="/exams/exam/:id/edit" exact component={EditExamForm} />
        <Route path="/exams/newExam" component={CreateExamForm} />
        <Route path="/timetable" component={Table} />
        <Route path="/dropzone" component={Dropzone} />
      </Router>
    </div>
  );
}

export default App;
