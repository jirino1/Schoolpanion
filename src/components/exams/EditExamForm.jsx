import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";

import {
  editExam,
  getExam,
  getTasks,
  editTask,
  createTask,
  getNextId,
  deleteTask,
  deleteTaskOfExam,
  getTableData
} from "../../actions";
import history from "../../history";
import Modal from "../Modal";
import { noSubjects } from "../../helpers";
import HelpButton from "../HelpButton";
import MyForm from "./MyForm";

class EditExamForm extends Component {
  constructor(props) {
    super(props);
    this.mapTasks = this.mapTasks.bind(this);
    this.state = { tasks: [] };
  }
  async componentDidMount() {
    const { id } = this.props.match.params;
    if (!this.props.exams.exam || this.props.exams.exam.id !== id) {
      console.log(id);
      await this.props.getExam(id);
    }
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
    await this.props.getNextId();
    if (this.props.table.subjects === null) {
      await this.props.getTableData();
    }
  }
  mapTasks(tasks) {
    //Tasks der Klausur mappen
    if (!tasks) {
      return [];
    }
    let taskArray = [];
    for (let i = 0; i < tasks.length; i++) {
      taskArray.push(this.props.tasks.list.find(task => task.id === tasks[i]));
    }
    return taskArray;
  }
  myForm() {
    return (
      <div>
        <Formik
          initialValues={{
            //Startwerte auf aktuelle Werte der Klausur
            subject: this.props.exams.exam.subject,
            date: this.props.exams.exam.date,
            tasks: this.mapTasks(this.props.exams.exam.tasks)
          }}
          enableReinitialize
          validateOnBlur={false}
          onSubmit={async values => {
            this.props.exams.exam.tasks.forEach(examTask => {
              if (!values.tasks.find(task => task.id === examTask)) {
                this.props.deleteTaskOfExam(this.props.exams.exam.id, examTask);
                this.props.deleteTask(examTask);
              }
            });
            let ids = [];
            let idNew = 0;
            for (let i = 0; i < this.props.tasks.list.length; i++) {
              if (idNew < this.props.tasks.list[i].id) {
                idNew = this.props.tasks.list[i].id;
              }
            }
            idNew += 1;
            console.log(idNew);
            for (let i = 1; i <= values.tasks.length; i++) {
              let newTask = {
                ...values.tasks[i - 1],
                origin: "exams",
                subject: values.subject
              };
              if (newTask.id) {
                await this.props.editTask(newTask.id, newTask);
                ids.push(newTask.id);
              } else {
                await this.props.createTask({
                  ...newTask,
                  examID: this.props.exams.exam.id
                });
                ids.push(idNew);
                idNew++;
              }
            }
            await this.props.editExam(this.props.exams.exam.id, {
              tasks: ids,
              subject: values.subject,
              date: values.date
            });

            history.push("/exams");
          }}
          validate={values => {
            let errors = {};
            if (!values.subject) {
              errors.subject = "Bitte geben sie ein Fach an";
            }
            if (!values.date) {
              errors.date = "Bitte geben sie ein gültiges Datum ein";
            }

            for (let i = 0; i < values.tasks.length; i++) {
              if (!errors.tasks) {
                errors.tasks = [];
              }
              errors.tasks[i] = {};
              if (!values.tasks[i].title) {
                errors.tasks[i].title = "Bitte geben sie einen Titel ein";
              }
              if (!values.tasks[i].date) {
                errors.tasks[i].date = "Bitte geben sie ein gültiges Datum ein";
              }
            }
            let noErrors = true;
            if (errors.tasks !== undefined) {
              for (let i = 0; i < errors.tasks.length; i++) {
                if (Object.getOwnPropertyNames(errors.tasks[i]).length !== 0) {
                  noErrors = false;
                }
              }
            }
            if (!errors.subject && !errors.date && noErrors) {
              return {};
            }
            return errors;
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <MyForm
              values={values}
              errors={errors}
              touched={touched}
              handleChange={handleChange}
              handleBlur={handleBlur}
              table={this.props.table}
            />
          )}
        </Formik>
      </div>
    );
  }

  render() {
    console.log(this.props);
    if (
      !this.props.tasks.list ||
      !this.props.exams.exam ||
      this.props.exams.exam.id !== parseInt(this.props.match.params.id) ||
      this.props.tasks.nextID === null ||
      !this.props.table.subjects
    ) {
      return <div>Lädt...</div>;
    } else if (
      !this.props.table.subjects ||
      this.props.table.subjects.length === 0
    ) {
      return (
        <Modal
          title="Ups!"
          content={noSubjects()}
          onDismiss={() => {
            history.push("/timetable");
          }}
          actions={HelpButton({ icon: false })}
        ></Modal>
      );
    }
    return (
      <div className="ui container">
        <h1 className="ui header">
          {" " + this.props.exams.exam.subject}-Klausur bearbeiten
        </h1>
        {this.myForm()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    exams: state.exams,
    tasks: state.tasks,
    table: state.table
  };
};

const mapDispatchToProps = {
  editExam,
  getExam: getExam,
  getTasks,
  editTask,
  createTask,
  getNextId,
  deleteTask,
  deleteTaskOfExam,
  getTableData
};

export default connect(mapStateToProps, mapDispatchToProps)(EditExamForm);
