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
  deleteTaskOfExam
} from "../../actions";
import history from "../../history";

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
  // theBoolean(values) {
  //   let b = true;
  //   for (let i = 0; i < values.length; i++) {
  //     if (!values[i]) {
  //       b = false;
  //     }
  //   }
  //   return b;
  // }
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
            const errors = {};
            if (!values.subject) {
              errors.subject = "Required";
            }
            if (!values.date) {
              errors.date = "Required";
            }
            return errors;
          }}
          render={({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <div className="ui labeled input">
                <label className="ui label">Subject: </label>
                <input
                  type="text"
                  name="subject"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.subject || ""}
                />
                {errors.subject && touched.subject && errors.subject}
              </div>
              <p />
              <div className="ui labeled input">
                <label className="ui label">Date: </label>
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
              <h3 className="ui header">Add Tasks</h3>
              <FieldArray name="tasks">
                {arrayHelpers => (
                  <div>
                    {values.tasks && values.tasks.length > 0 ? (
                      <div>
                        {values.tasks.map((task, index) => {
                          return (
                            <div key={index}>
                              <h4
                                style={{ textAlign: "left" }}
                                className="ui horizontal divider header"
                              >
                                {"Task " + index}{" "}
                                <span
                                  style={{
                                    paddingLeft: "10px",
                                    alignContent: "bottom"
                                  }}
                                >
                                  <button
                                    style={{ height: "100%" }}
                                    className="ui icon button"
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                  >
                                    <i className=" trash icon"></i>
                                  </button>
                                </span>
                              </h4>
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
                                  <label className="ui label">Title: </label>
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
                                  <label className="ui label">Date: </label>
                                  <Field
                                    name={`tasks[${index}].date`}
                                    type="date"
                                    value={task.date || ""}
                                  />
                                </div>
                                {errors &&
                                errors.tasks !== null &&
                                errors.tasks !== undefined &&
                                errors.tasks[index] !== null &&
                                errors.tasks[index] !== undefined &&
                                typeof errors.tasks[index].date === "string" &&
                                touched.tasks &&
                                touched.tasks[index] !== null &&
                                touched.tasks[index] !== undefined &&
                                typeof touched.tasks[index].date ===
                                  "boolean" ? (
                                  <span>{errors.tasks[index].date}</span>
                                ) : null}
                              </div>
                              <textarea
                                name={`tasks[${index}].description]`}
                                value={task.description || ""}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className="field"
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
                            Add Tasks
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
                        Add Tasks
                      </button>
                    )}
                    <div>
                      <p />
                      <button className="ui button" type="submit">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        />
      </div>
    );
  }

  render() {
    if (
      !this.props.tasks.list ||
      !this.props.exams.exam ||
      this.props.tasks.nextID === null
    ) {
      return <div>Loading...</div>;
    }
    return (
      <div className="ui container">
        <h1 className="ui header">
          Edit the {" " + this.props.exams.exam.subject}-Exam
        </h1>
        {this.myForm()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    exams: state.exams,
    tasks: state.tasks
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
  deleteTaskOfExam
};

export default connect(mapStateToProps, mapDispatchToProps)(EditExamForm);
