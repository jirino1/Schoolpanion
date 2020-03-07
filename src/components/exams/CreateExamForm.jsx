import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";

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

class CreateExamForm extends Component {
  async componentDidMount() {
    await this.props.getNextExamId();
    if (this.props.exams.list === null) {
      await this.props.getExams();
    }
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
  }
  optionmapper() {
    // console.log(this.props.table.subjects);
    let subjects = [];
    for (let i = 0; i < this.props.table.subjects.length; i++) {
      subjects.push({
        text: this.props.table.subjects[i],
        key: i,
        value: this.props.table.subjects[i]
      });
    }
    // console.log(subjects);
    return subjects;
  }
  myForm() {
    return (
      <div>
        <Formik
          initialValues={{ subject: "", date: "", tasks: [] }}
          onSubmit={async values => {
            let ids = [];
            let idNew = 0;
            for (let i = 0; i < this.props.tasks.list.length; i++) {
              if (idNew < this.props.tasks.list[i].id) {
                idNew = this.props.tasks.list[i].id;
              }
            }
            for (let i = 1; i <= values.tasks.length; i++) {
              let newTask = {
                ...values.tasks[i - 1],
                origin: "exams",
                subject: values.subject,
                examID: this.props.exams.nextID
              };
              console.log(newTask);
              await this.props.createTask(newTask);
              ids.push(idNew + i);
            }
            await this.props.createExam({
              tasks: ids,
              subject: values.subject,
              date: values.date
            });

            history.push("/exams");
          }}
          validate={values => {
            let errors = {};
            if (!values.subject) {
              errors.subject = "Required";
            }
            if (!values.date) {
              errors.date = "Required";
            }

            for (let i = 0; i < values.tasks.length; i++) {
              if (!errors.tasks) {
                errors.tasks = [];
              }
              errors.tasks[i] = {};
              if (!values.tasks[i].title) {
                errors.tasks[i].title = "Required";
              }
              if (!values.tasks[i].date) {
                errors.tasks[i].date = "Required";
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
            <Form>
              <div
                style={{
                  padding: "0.6px",
                  backgroundColor: "white"
                }}
                className="ui labeled input"
              >
                <label className="ui label">Fach: </label>
                <select
                  className="ui search dropdown"
                  style={{
                    borderTopRightRadius: "5px",
                    borderBottomRightRadius: "5px",
                    border: "none"
                  }}
                  name="subject"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subject || ""}
                >
                  <option
                    style={{ color: "light grey" }}
                    defaultValue
                    hidden
                    key={""}
                  >
                    Fach...
                  </option>
                  ;
                  {this.props.table.subjects.map(subject => {
                    return <option key={subject}>{subject}</option>;
                  })}
                </select>
                {errors.subject && touched.subject && errors.subject}
              </div>
              <p />
              <div
                style={{
                  paddingLeft: "0.6px",
                  paddingTop: "0.6px"
                }}
                className="ui labeled input"
              >
                <label className="ui label">Datum: </label>
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.date || ""}
                />
                {errors.date && touched.date && errors.date}
              </div>
              <p />
              <h3 className="ui header">Aufgaben hinzufügen</h3>
              <FieldArray name="tasks">
                {arrayHelpers => (
                  <div>
                    {values.tasks && values.tasks.length > 0 ? (
                      <div>
                        {values.tasks.map((task, index) => {
                          return (
                            <div key={index}>
                              <div className="ui horizontal divider header">
                                <h4
                                  style={{
                                    display: "flex"
                                  }}
                                >
                                  <div
                                    style={{
                                      alignSelf: "center",
                                      paddingRight: "5px"
                                    }}
                                    className="left floated content"
                                  >
                                    {"Aufgabe " + (index + 1)}
                                  </div>
                                  <span
                                    className="ui right floated small icon button"
                                    type="button"
                                    style={{
                                      float: "right",
                                      padding: "0.5em"
                                    }}
                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                  >
                                    <i className="trash icon"></i>
                                  </span>
                                </h4>
                              </div>

                              <div
                                style={{ display: "flex", marginBottom: "5px" }}
                                key={index}
                              >
                                <div
                                  style={{
                                    paddingLeft: "0.6px"
                                  }}
                                  className="ui labeled input"
                                >
                                  <label className="ui label">Titel: </label>
                                  <Field
                                    name={`tasks[${index}].title]`}
                                    value={task.title || ""}
                                  />
                                </div>
                                {errors &&
                                errors.tasks !== null &&
                                errors.tasks !== undefined &&
                                errors.tasks[index] !== null &&
                                errors.tasks[index] !== undefined &&
                                typeof errors.tasks[index].title === "string" &&
                                touched.tasks &&
                                touched.tasks[index] !== null &&
                                touched.tasks[index] !== undefined &&
                                typeof touched.tasks[index].title ===
                                  "boolean" ? (
                                  <span>{errors.tasks[index].title}</span>
                                ) : null}
                                <div
                                  style={{
                                    marginLeft: "5px",
                                    paddingRight: "0.5px"
                                  }}
                                  className="ui labeled input"
                                >
                                  <label className="ui label">Datum: </label>
                                  <Field
                                    name={`tasks[${index}].date`}
                                    type="date"
                                    value={task.date || ""}
                                  />
                                  {errors &&
                                  errors.tasks !== null &&
                                  errors.tasks !== undefined &&
                                  errors.tasks[index] !== null &&
                                  errors.tasks[index] !== undefined &&
                                  typeof errors.tasks[index].date ===
                                    "string" &&
                                  touched.tasks &&
                                  touched.tasks[index] !== null &&
                                  touched.tasks[index] !== undefined &&
                                  typeof touched.tasks[index].date ===
                                    "boolean" ? (
                                    <span>{errors.tasks[index].date}</span>
                                  ) : null}
                                </div>
                              </div>
                              <textarea
                                name={`tasks[${index}].description]`}
                                placeholder="Beschreibung (optional)"
                                value={task.description || ""}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className="ui textarea"
                              ></textarea>

                              <br />
                            </div>
                          );
                        })}
                        <p />
                        <div>
                          <button
                            className="ui button"
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({ title: "", date: "" })
                            }
                          >
                            {/* show this when user has removed all friends from the list */}
                            Aufgaben hinzufügen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="ui button"
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({ title: "", date: "" })
                        }
                      >
                        {/* show this when user has removed all friends from the list */}
                        Aufgaben hinzufügen
                      </button>
                    )}
                    <div>
                      <p />
                      <button className="ui button" type="submit">
                        Bestätigen
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
  // renderHelp() {
  //   return <HelpButton />;
  // }
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
        <Modal
          title="HMMM"
          content={noSubjects()}
          onDismiss={() => {
            history.push("/timetable");
          }}
          actions={HelpButton({ icon: false })}
        ></Modal>
      );
    }
    // console.log(this.state);
    // console.log(this.props);
    else {
      return (
        <div className="ui container">
          <h1 className="ui header">Klausur erstellen</h1>
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
