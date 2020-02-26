import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getTasks,
  getExams,
  markDone,
  deleteTask,
  deleteTaskOfExam
} from "../actions";
import { sortByDates, getRemainingDays } from "../helpers";
import MyAccordion from "./MyAccordion";
import Table from "./timetable/Table";
import history from "../history";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = { sortedTasks: null, tasksShown: true, tableShown: false };
    this.mapSortedTasks = this.mapSortedTasks.bind(this);
  }

  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
    if (this.props.exams.list === null) {
      await this.props.getExams();
    }
    this.mapSortedTasks();
  }
  mapSortedTasks() {
    this.setState({ sortedTasks: sortByDates(this.props.tasks.list) });
  }

  render() {
    console.log(this.state);
    if (!this.state.sortedTasks) {
      return <div>Loading...</div>;
    }
    return (
      <div className="ui container">
        <header style={{ textAlign: "center" }} className="ui header">
          <h1>Willkommen zurück, DAU!</h1>
        </header>
        <MyAccordion
          content={[
            this.props.tasks.list.length !== 0
              ? this.renderTasks(this.state.sortedTasks)
              : "",
            <Table disabled />
          ]}
          title={["Anstehende Aufgaben", "Stundenplan"]}
        ></MyAccordion>
      </div>
    );
  }
  renderTasks(tasks) {
    return (
      <table
        style={{ textAlign: "left", padding: "15px" }}
        className="ui unstackable selectable table"
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Subject</th>
            <th>Remaining time</th>
            <th>Origin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const remainingDays = getRemainingDays(task.date);
            return (
              <tr
                key={task.id}
                onClick={() => {
                  history.push(
                    task.origin === "homework"
                      ? `/homework/homework/${task.id}`
                      : `/exams/exam/${task.examID}`
                  );
                }}
              >
                <td style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  {task.title}
                </td>
                <td style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  {task.subject}
                </td>
                <td
                  style={{
                    color:
                      remainingDays.unit === "h" || remainingDays.time < 2
                        ? "red"
                        : "grey",
                    paddingLeft: "10px",
                    paddingRight: "10px"
                  }}
                >
                  {remainingDays.time < 0
                    ? "Expired"
                    : remainingDays.time + remainingDays.unit}
                </td>
                <td style={{ padding: "15px" }}>{task.origin}</td>
                <td>
                  <div className="ui small icon buttons">
                    <button
                      style={
                        task.completed ? { backgroundColor: "grey" } : undefined
                      }
                      className="ui small icon button"
                      onClick={async e => {
                        e.stopPropagation();
                        console.log("BOOM!", e);
                        await this.props.markDone(task.id);
                      }}
                    >
                      <i className="check icon"></i>
                    </button>
                    <button
                      className="ui small icon button"
                      id={task.id}
                      onClick={e => {
                        e.stopPropagation();
                        history.push(
                          task.origin === "homework"
                            ? `/homework/homework/${task.id}/edit`
                            : `/exams/exam/${task.examID}/edit`
                        );
                      }}
                    >
                      <i className="edit icon"></i>
                    </button>
                    <button
                      className="ui small icon button"
                      id={task.id}
                      onClick={async e => {
                        e.stopPropagation();
                        if (task.origin === "homework") {
                          await this.props.deleteTask(task.id);
                          this.mapSortedTasks();
                        } else {
                          await this.props.deleteTaskOfExam(
                            task.examID,
                            task.id
                          );
                          await this.props.deleteTask(task.id);
                          this.mapSortedTasks();
                        }
                      }}
                    >
                      <i className="trash alternate outline icon"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
const mapStateToProps = state => {
  return { tasks: state.tasks, exams: state.exams };
};

const mapDispatchToProps = {
  getTasks: getTasks,
  getExams,
  markDone,
  deleteTask,
  deleteTaskOfExam
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
