import React, { Component } from "react";
import { connect } from "react-redux";

import { getTasks, getTask, markDone, deleteTask } from "../../actions";
import { getRemainingDays, HoverSegment } from "../../helpers";
import history from "../../history";
import Modal from "../Modal";

class Homework extends Component {
  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
    const { id } = this.props.match.params;
    this.props.getTask(id);
  }

  render() {
    const { task } = this.props.tasks;

    if (task === null) {
      return <div>Lädt...</div>;
    }
    if (task === undefined) {
      return (
        <Modal
          title="Fehler"
          content="Die Aufgabe, die sie suchen, existiert nicht"
          onDismiss={() => {
            history.goBack();
          }}
        ></Modal>
      );
    }
    const remainingDays = getRemainingDays(task.date);
    return (
      <div className="ui container">
        <header className="ui center aligned header">
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                paddingRight: "10px"
              }}
              className="content"
            >
              {task.subject + "-Aufgabe"}
            </div>
            <span style={{ marginTop: "1px" }} className="ui icon buttons">
              <button
                style={{ padding: "0.6em", border: "none" }}
                className="ui icon button"
                id={task.id}
                onClick={() => {
                  history.push(`/homework/homework/${task.id}/edit`);
                }}
              >
                <i className="edit icon"></i>
              </button>
              <button
                style={{ padding: "0.6em", border: "none" }}
                className="ui icon button"
                id={task.id}
                onClick={() => {
                  history.push(`/tasks/task/${task.id}/delete`);
                }}
              >
                <i className="trash alternate outline icon"></i>
              </button>
            </span>
          </h1>
        </header>
        <HoverSegment
          onClick={() => {
            this.props.markDone(task.id);
          }}
          style={{
            backgroundColor: task.completed ? "grey" : "white"
          }}
          className="ui segment"
        >
          <div>
            <header className="ui center aligned header">
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <div
                  style={{
                    paddingRight: "10px",
                    color: !task.completed ? "black" : "white",
                    textShadow: task.completed
                      ? "-0.5px 0 black, 0 0.5px black, 0.5px 0 black, 0 -0.5px black"
                      : "none"
                  }}
                  className="content"
                >
                  {task.title}
                </div>
                <label
                  className={
                    remainingDays.unit === "h" || remainingDays.time < 2
                      ? " ui red right floated label "
                      : "ui right floated label"
                  }
                >
                  {remainingDays.time + remainingDays.unit}
                </label>
              </h3>
            </header>
          </div>

          <div className="content">{task.description}</div>
        </HoverSegment>
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
  getTasks,
  getTask,
  markDone: markDone,
  deleteTask: deleteTask
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
