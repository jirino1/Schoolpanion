import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik } from "formik";

import {
  createExam,
  getExams,
  getTasks,
  createTask,
  getNextExamId,
  getTableData
} from "../../actions";
import history from "../../history";
import Modal from "../Modal";
import { noSubjects } from "../../helpers";
import HelpButton from "../HelpButton";
import MyForm from "./MyForm";

class CreateExamForm extends Component {
  async componentDidMount() {
    //Daten abrufen
    await this.props.getNextExamId();
    if (this.props.exams.list === null) {
      await this.props.getExams();
    }
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
  }
  optionmapper() {
    //options für Subject-Selector
    let subjects = [];
    for (let i = 0; i < this.props.table.subjects.length; i++) {
      subjects.push({
        text: this.props.table.subjects[i],
        key: i,
        value: this.props.table.subjects[i]
      });
    }
    return subjects;
  }
  myForm() {
    return (
      <div>
        <Formik
          initialValues={{ subject: "", date: "", tasks: [] }}
          onSubmit={async values => {
            //nextID ermitteln
            let ids = [];
            let idNew = 0;
            for (let i = 0; i < this.props.tasks.list.length; i++) {
              if (idNew < this.props.tasks.list[i].id) {
                idNew = this.props.tasks.list[i].id;
              }
            }
            //für jeden Value eine Aufgabe erzeugen
            for (let i = 1; i <= values.tasks.length; i++) {
              let newTask = {
                ...values.tasks[i - 1],
                origin: "exams",
                subject: values.subject,
                examID: this.props.exams.nextID
              };
              await this.props.createTask(newTask);
              ids.push(idNew + i);
            }
            //Klausur erzeugen
            await this.props.createExam({
              tasks: ids,
              subject: values.subject,
              date: values.date
            });

            history.push("/exams");
          }}
          validate={values => {
            //Überprüfen, ob alle Felder ausgefüllt sind
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
            //MyForm soll die Felder beinhalten
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
    if (!this.props.exams.nextID && !this.props.table.subjects) {
      return <div>Lädt...</div>;
    } else if (!this.props.exams.nextID) {
      return <div>Lädt...</div>;
    } else if (
      !this.props.table.subjects ||
      this.props.table.subjects.length === 0
    ) {
      return (
        //wenn keine Fächer hinzugefügt wurden
        <Modal
          title="HMMM"
          content={noSubjects()}
          onDismiss={() => {
            history.push("/timetable");
          }}
          actions={HelpButton({ icon: false })}
        ></Modal>
      );
    } else {
      return (
        <div className="ui container">
          <h1 style={{ textAlign: "center" }} className="ui header">
            Klausur erstellen
          </h1>
          {this.myForm()}
        </div>
      );
    }
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
  createExam: createExam,
  getExams: getExams,
  getTasks,
  createTask,
  getNextExamId,
  getTableData
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateExamForm);
