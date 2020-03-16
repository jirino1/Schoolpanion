import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";

import { createTask, getTasks, getTableData } from "../../actions";
import history from "../../history";
import { noSubjects } from "../../helpers";
import Modal from "../Modal";
import HelpButton from "../HelpButton";

class CreateHomeworkForm extends Component {
  //neue Hausaufgabe erstellen
  constructor(props) {
    super(props);
    this.state = { subject: null, date: null, task: null };
    this.onHomeworkSubmit = this.onHomeworkSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTaskChange = this.onTaskChange.bind(this);
    this.optionmapper = this.optionmapper.bind(this);
  }
  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
    if (this.props.table.subjects === null) {
      await this.props.getTableData();
    }
  }
  async onHomeworkSubmit() {
    //validation
    if (this.state.task === null) {
      this.setState({ emptyTask: true });
    }
    if (this.state.subject === null) {
      this.setState({ emptySubject: true });
    }
    if (this.state.date === null) {
      this.setState({ emptyDate: true });
    }
    if (
      this.state.task !== null &&
      this.state.subject !== null &&
      this.state.date !== null
    ) {
      const homework = {
        title: this.state.task,
        subject: this.state.subject,
        date: this.state.date,
        completed: false,
        description: this.state.description ? this.state.description : ""
      };
      await this.props.createTask({ ...homework, origin: "homework" });
      history.push("/homework");
    }
  }

  handleChange = (e, { value }) => this.setState({ subject: value });
  onDateChange(event) {
    this.setState({ date: event.target.value });
  }
  onTaskChange(event) {
    this.setState({ task: event.target.value });
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
    if (!this.props.table.subjects) {
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
            <h1>Hausaufgabe erstellen</h1>
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
              placeholder="Subject..."
              search
              selection
              options={this.optionmapper()}
              onChange={this.handleChange}
              value={this.state.subject}
            />
          </div>
          <br />
          <div
            className={
              this.state.emptyDate
                ? "ui labeled input error"
                : "ui labeled input"
            }
            style={{
              marginTop: "5px",
              marginBottom: "5px",
              paddingBottom: "0.6px"
            }}
          >
            <div className={this.state.emptyDate ? "ui red label" : "ui label"}>
              Datum:{" "}
            </div>
            <input
              type="date"
              placeholder="Due to"
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
            style={{ marginBottom: "5px", paddingBottom: "0.5px" }}
          >
            <div className={this.state.emptyTask ? "ui red label" : "ui label"}>
              Titel:{" "}
            </div>
            <input
              type="text"
              placeholder="Aufgabe"
              onChange={this.onTaskChange}
            />
          </div>
          <br />
          <textarea
            placeholder="Beschreibung (optional)"
            onChange={e => {
              this.setState({ description: e.target.value });
            }}
            className="ui textarea"
          ></textarea>
          <br />
          <div className="ui button" onClick={this.onHomeworkSubmit}>
            Hausaufgabe erstellen
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
  createTask: createTask,
  getTasks: getTasks,
  getTableData
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateHomeworkForm);
