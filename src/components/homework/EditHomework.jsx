import React, { Component } from "react";
import { connect } from "react-redux";

import { editTask, getTask } from "../../actions";
import history from "../../history";
import { Dropdown } from "semantic-ui-react";
import Modal from "../Modal";
import { noSubjects } from "../../helpers";
import HelpButton from "../HelpButton";

class EditHomework extends Component {
  //Hausaufgaben bearbeiten
  constructor(props) {
    super(props);
    this.state = { subject: null, date: null, title: null };
    this.onHomeworkSubmit = this.onHomeworkSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTaskChange = this.onTaskChange.bind(this);
    this.optionmapper = this.optionmapper.bind(this);
  }
  async componentDidMount() {
    await this.props.getTask(this.props.match.params.id);
    if (this.props.table.subjects === null) {
      await this.props.getTableData();
    }
  }
  componentDidUpdate() {
    const { task } = this.props.tasks;
    if (
      this.state.title === null &&
      this.state.subject === null &&
      this.state.date === null
    ) {
      this.setState({
        subject: task.subject,
        date: task.date,
        title: task.title,
        description: task.description
      });
    }
  }
  async onHomeworkSubmit() {
    if (!this.state.title) {
      this.setState({ emptyTask: true });
    }
    if (!this.state.subject) {
      this.setState({ emptySubject: true });
    }
    if (!this.state.date) {
      this.setState({ emptyDate: true });
    }
    if (this.state.title && this.state.subject && this.state.date) {
      const homework = {
        title: this.state.title,
        subject: this.state.subject,
        date: this.state.date,
        completed: false,
        description: this.state.description ? this.state.description : ""
      };
      await this.props.editTask(this.props.match.params.id, {
        ...homework,
        origin: "homework"
      });
      history.push("/homework");
    }
  }

  handleChange = (e, { value }) => this.setState({ subject: value });
  onDateChange(event) {
    this.setState({ date: event.target.value });
  }
  onTaskChange(event) {
    this.setState({ title: event.target.value });
  }
  optionmapper() {
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

  render() {
    const { task } = this.props.tasks;
    if (
      !this.props.table.subjects ||
      !task ||
      task.id !== parseInt(this.props.match.params.id)
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
    } else {
      return (
        <div className="ui container">
          <header className="ui header">
            <h1>{task.subject + "-Aufgabe bearbeiten"}</h1>
          </header>
          <div
            style={{ paddingRight: "1px", paddingBottom: "0.6px" }}
            className={
              this.state.emptySubject
                ? "ui labeled input error"
                : "ui labeled input"
            }
          >
            <div
              className={this.state.emptySubject ? "ui red label" : "ui label"}
            >
              Fach:{" "}
            </div>

            <Dropdown
              error={this.state.emptySubject}
              defaultValue={task.subject}
              search
              selection
              options={this.optionmapper()}
              onChange={this.handleChange}
            />
          </div>
          <br />
          <div
            className={
              this.state.emptyDate
                ? "ui labeled input error"
                : "ui labeled input"
            }
            style={{ marginTop: "5px", marginBottom: "5px" }}
          >
            <div className={this.state.emptyDate ? "ui red label" : "ui label"}>
              Datum:{" "}
            </div>
            <input
              type="date"
              placeholder="Due to"
              defaultValue={task.date}
              onChange={this.onDateChange}
            />
          </div>
          <br />
          <div
            className={
              this.state.emptyTask
                ? "ui labeled input error"
                : "ui labeled input"
            }
            style={{ marginBottom: "5px", paddingBottom: ".5px" }}
          >
            <div className={this.state.emptyTask ? "ui red label" : "ui label"}>
              Titel:{" "}
            </div>
            <input
              type="text"
              placeholder="Title"
              defaultValue={task.title}
              onChange={this.onTaskChange}
            />
          </div>
          <br />
          <textarea
            defaultValue={task.description}
            placeholder="Beschreibung (optional)"
            onChange={e => {
              this.setState({ description: e.target.value });
            }}
            className="field"
          ></textarea>
          <br />
          <div className="ui button" onClick={this.onHomeworkSubmit}>
            Aufgabe bearbeiten
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks,
    table: state.table
  };
};

const mapDispatchToProps = {
  editTask: editTask,
  getTask: getTask
};

export default connect(mapStateToProps, mapDispatchToProps)(EditHomework);
