import React, { Component } from "react";
import { connect } from "react-redux";

import { editTask, getTasks, getTask } from "../../actions";
import history from "../../history";

class EditHomework extends Component {
  constructor(props) {
    super(props);
    this.state = { subject: "Subject...", date: "Due To...", task: "Task..." };
    this.onHomeworkSubmit = this.onHomeworkSubmit.bind(this);
    this.onSubjectChange = this.onSubjectChange.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onTaskChange = this.onTaskChange.bind(this);
  }
  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
    const { id } = this.props.match.params;
    await this.props.getTask(id);
    const { task } = this.props.tasks;
    this.setState({ subject: task.subject, date: task.date, task: task.title });
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
        date: this.state.date
      };
      await this.props.editTask(this.props.tasks.task.id, homework);
      history.push("/homework");
    }
  }

  onSubjectChange(event) {
    this.setState({ subject: event.target.value });
  }
  onDateChange(event) {
    this.setState({ date: event.target.value });
  }
  onTaskChange(event) {
    this.setState({ task: event.target.value });
  }

  render() {
    if (this.props.tasks.task === null) {
      return <div>Loading...</div>;
    }
    // console.log(this.props);
    return (
      <div className="ui container">
        <div
          className={
            this.state.emptySubject
              ? "ui labeled input error"
              : "ui labeled input"
          }
        >
          <div className="ui label">Subject: </div>
          <input
            type="text"
            value={this.state.subject}
            onChange={this.onSubjectChange}
          />
        </div>
        <br />
        <div
          className={
            this.state.emptyDate ? "ui labeled input error" : "ui labeled input"
          }
        >
          <div className="ui label">Due to: </div>
          <input
            type="date"
            value={this.state.date}
            onChange={this.onDateChange}
          />
        </div>
        <br />
        <div
          className={
            this.state.emptyTask ? "ui labeled input error" : "ui labeled input"
          }
        >
          <div className="ui label">Task: </div>
          <input
            type="text"
            value={this.state.task}
            onChange={this.onTaskChange}
          />
        </div>
        <br />
        <div className="ui button" onClick={this.onHomeworkSubmit}>
          Submit changes
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks
  };
};

const mapDispatchToProps = {
  editTask: editTask,
  getTasks: getTasks,
  getTask: getTask
};

export default connect(mapStateToProps, mapDispatchToProps)(EditHomework);
