import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getTasks,
  getExams,
  markDone,
  deleteTask,
  deleteTaskOfExam,
  deleteExam
} from "../actions";
import { sortByDates, getRemainingDays } from "../helpers";
import MyAccordion from "./MyAccordion";
import Table from "./timetable/Table";
import history from "../history";

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      upcomingTasks: null,
      doneTasks: null,
      tasksShown: true,
      tableShown: false
    };
    this.mapUpcomingTasks = this.mapUpcomingTasks.bind(this);
    this.mapDoneTasks = this.mapDoneTasks.bind(this);
  }

  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
    if (this.props.exams.list === null) {
      await this.props.getExams();
    }
    //Anstehende Aufgaben und erledigte Aufgaben trennen
    this.mapUpcomingTasks();
    this.mapDoneTasks();
    this.props.tasks.list.forEach(async task => {
      if (
        getRemainingDays(task.date).time <= -14 &&
        getRemainingDays(task.date).unit === "d"
      ) {
        if (task.origin === "exams") {
          await this.props.deleteTaskOfExam(task.examID, task.id);
        }
        await this.props.deleteTask(task.id);
      }
    });
    this.props.exams.list.forEach(async exam => {
      if (
        getRemainingDays(exam.date).time < -14 &&
        getRemainingDays(exam.date).unit === "d"
      ) {
        exam.tasks.forEach(async task => {
          await this.props.deleteTask(task);
        });
        await this.props.deleteExam(exam.id);
      }
    });
  }
  mapUpcomingTasks() {
    let upcomingTasks = sortByDates(this.props.tasks.list);
    upcomingTasks = upcomingTasks.filter(task => !task.completed);
    while (upcomingTasks.length > 5) {
      upcomingTasks.pop();
    }
    this.setState({ upcomingTasks });
  }
  mapDoneTasks() {
    let doneTasks = sortByDates(this.props.tasks.list);
    doneTasks = doneTasks.filter(task => task.completed);
    while (doneTasks.length > 5) {
      doneTasks.pop();
    }
    this.setState({ doneTasks });
  }

  render() {
    if (!this.state.upcomingTasks || !this.state.doneTasks) {
      return <div>Lädt...</div>;
    }
    return (
      <div className="ui container">
        <header style={{ textAlign: "center" }} className="ui header">
          <h1>Willkommen zurück!</h1>
        </header>
        {/* Akkordeon */}
        <MyAccordion
          content={[
            this.props.tasks.list.length !== 0
              ? this.renderTasks(this.state.upcomingTasks)
              : "",
            <Table disabled />,
            this.props.tasks.list.length !== 0
              ? this.renderTasks(this.state.doneTasks)
              : ""
          ]}
          title={["Anstehende Aufgaben", "Stundenplan", "Erledigte Aufgaben"]}
        ></MyAccordion>
      </div>
    );
  }
  renderTasks(tasks) {
    //Tabelle, welche anstehende Aufgaben anzeigt
    return (
      <table
        style={{ textAlign: "left", padding: "15px" }}
        className="ui unstackable selectable table"
      >
        <thead>
          <tr>
            <th>Titel</th>
            <th>Fach</th>
            <th>Verbleibende Zeit</th>
            <th>Aufgabentyp</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
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
                  <div
                    style={index === 0 ? {} : { paddingBottom: "0.6px" }}
                    className="ui small icon buttons"
                  >
                    <button
                      style={
                        task.completed
                          ? { backgroundColor: "grey" }
                          : { border: "none" }
                      }
                      className="ui small icon button"
                      onClick={async e => {
                        e.stopPropagation();
                        await this.props.markDone(task.id);
                        this.mapUpcomingTasks();
                        this.mapDoneTasks();
                      }}
                    >
                      <i className="check icon"></i>
                    </button>
                    <button
                      style={{ border: "none" }}
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
                      style={{ border: "none" }}
                      className="ui small icon button"
                      id={task.id}
                      onClick={async e => {
                        e.stopPropagation();
                        history.push(`/homework/homework/${task.id}/delete`);
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
  deleteTaskOfExam,
  deleteExam
};

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
