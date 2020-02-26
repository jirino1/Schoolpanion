import React, { Component } from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";

import { createTask, getTasks, getTableData } from "../../actions";
import history from "../../history";

class CreateHomeworkForm extends Component {
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
        completed: false
      };
      await this.props.createTask({ ...homework, origin: "homework" });
      // console.log(homework);
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

  render() {
    console.log(this.state);
    if (!this.props.table.subjects) {
      return <div>Loading...</div>;
    } else {
      // console.log(this.state);
      return (
        <div className="ui container">
          <header className="ui header">
            <h1>Create a Homework</h1>
          </header>
          <div className="ui label">Subject: </div>
          <Dropdown
            placeholder="Subject..."
            search
            selection
            options={this.optionmapper()}
            onChange={this.handleChange}
            value={this.state.subject}
          />
          <br />
          <div
            className={
              this.state.emptyDate
                ? "ui labeled input error"
                : "ui labeled input"
            }
            style={{ marginTop: "5px", marginBottom: "5px" }}
          >
            <div className="ui label">Due to: </div>
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
            style={{ marginBottom: "5px" }}
          >
            <div className="ui label">Task: </div>
            <input
              type="text"
              placeholder="Task"
              onChange={this.onTaskChange}
            />
          </div>
          <br />
          <div className="ui button" onClick={this.onHomeworkSubmit}>
            Create Homework
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
