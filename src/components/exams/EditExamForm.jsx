import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field, FieldArray } from "formik";

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
  mapTasks(tasks) {
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
            for (let i = 0; i < values.tasks.length; i++) {
              if (values.tasks[i].id && values.tasks[i].id > idNew) {
                idNew = values.tasks[i].id;
              }
            }
            idNew += 1;
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
                await this.props.createTask(newTask);
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
            <Form>
              <div>
                <div
                  style={{
                    paddingTop: "0.5px",
                    backgroundColor: "white"
                  }}
                  className="ui labeled input"
                >
                  <label
                    className={
                      errors.subject && touched.subject
                        ? "ui red label"
                        : "ui label"
                    }
                  >
                    Fach:{" "}
                  </label>
                  <select
                    className={
                      errors.subject && touched.subject
                        ? "ui error search dropdown"
                        : "ui search dropdown"
                    }
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
                </div>
                {errors.subject && touched.subject ? (
                  <div style={{ color: "red" }}>{errors.subject}</div>
                ) : null}
              </div>

              <p />
              <div>
                <div
                  style={{
                    paddingLeft: "0.6px",
                    paddingTop: "0.6px"
                  }}
                  className={
                    errors.date && touched.date
                      ? "ui labeled error input"
                      : "ui labeled input"
                  }
                >
                  <label
                    className={
                      errors.date && touched.date ? "ui red label" : "ui label"
                    }
                  >
                    Datum:{" "}
                  </label>
                  <input
                    type="date"
                    name="date"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.date || ""}
                  />
                </div>
                {errors.date && touched.date ? (
                  <div style={{ color: "red" }}>{errors.date}</div>
                ) : (
                  <></>
                )}
              </div>

              <p />
              <h3 className="ui header">Aufgaben hinzufügen</h3>
              <FieldArray name="tasks">
                {arrayHelpers => (
                  <div>
                    {values.tasks && values.tasks.length > 0 ? (
                      <div>
                        {values.tasks.map((task, index) => {
                          let dateError = false;
                          let titleError = false;
                          if (
                            errors &&
                            errors.tasks &&
                            errors.tasks[index] &&
                            errors.tasks[index].title &&
                            touched.tasks &&
                            touched.tasks[index] &&
                            touched.tasks[index].title
                          ) {
                            titleError = true;
                          }
                          if (
                            errors &&
                            errors.tasks &&
                            errors.tasks[index] &&
                            errors.tasks[index].date &&
                            touched.tasks &&
                            touched.tasks[index] &&
                            touched.tasks[index].date
                          ) {
                            dateError = true;
                          }
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
                                <div>
                                  <div
                                    style={{
                                      paddingLeft: "0.6px"
                                    }}
                                    className={
                                      titleError
                                        ? "ui labeled error input"
                                        : "ui labeled input"
                                    }
                                  >
                                    <label
                                      className={
                                        titleError
                                          ? "ui light red label"
                                          : "ui label"
                                      }
                                    >
                                      Titel:{" "}
                                    </label>
                                    <Field
                                      name={`tasks[${index}].title]`}
                                      value={task.title || ""}
                                    />
                                  </div>
                                  {titleError ? (
                                    <div style={{ color: "red" }}>
                                      {errors.tasks[index].title}
                                    </div>
                                  ) : null}
                                </div>
                                <div>
                                  <div
                                    style={{
                                      marginLeft: "4.9px"
                                    }}
                                    className={
                                      dateError
                                        ? "ui labeled error input"
                                        : "ui labeled input"
                                    }
                                  >
                                    <label
                                      className={
                                        dateError
                                          ? "ui light red label"
                                          : "ui label"
                                      }
                                    >
                                      Datum:{" "}
                                    </label>
                                    <Field
                                      name={`tasks[${index}].date`}
                                      type="date"
                                      value={task.date || ""}
                                    />
                                  </div>
                                  {dateError ? (
                                    <div style={{ color: "red" }}>
                                      {errors.tasks[index].date}
                                    </div>
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
