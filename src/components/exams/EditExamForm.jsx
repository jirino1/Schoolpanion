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
              <FieldArray
                name="tasks"
                render={arrayHelpers => (
                  <div>
                    {values.tasks && values.tasks.length > 0 ? (
                      // && this.theBoolean(values)
                      values.tasks.map((task, index) => (
                        <div key={index}>
                          <div className="ui labeled input">
                            <label className="ui label">Title: </label>
                            <Field
                              className="ui input"
                              name={`tasks.[${index}].title]`}
                              value={task.title || ""}
                            />
                          </div>
                          {/* {errors.tasks[index].title && touched.tasks[index].title && errors.tasks[index].title} */}
                          <div
                            style={{ marginLeft: "5px" }}
                            className="ui labeled input"
                          >
                            <label className="ui label">Date: </label>
                            <Field
                              name={`tasks.[${index}].date`}
                              type="date"
                              value={task.date || ""}
                            />
                          </div>
                          <div className="ui icon buttons">
                            <button
                              className="ui icon button"
                              type="button"
                              onClick={async () => {
                                arrayHelpers.remove(index);
                              }} // remove a friend from the list
                            >
                              <i className="minus icon"></i>
                            </button>
                            <button
                              className=" right attached ui icon button"
                              type="button"
                              onClick={() =>
                                arrayHelpers.insert(index + 1, {
                                  title: "",
                                  date: ""
                                })
                              } // insert an empty string at a position
                            >
                              <i className="ui plus icon" />
                            </button>
                          </div>
                          <p />
                        </div>
                      ))
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
              />
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
