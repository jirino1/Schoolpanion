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
