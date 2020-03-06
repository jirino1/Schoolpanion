import React, { Component } from "react";
import { connect } from "react-redux";

import { getTasks, getTask, markDone, deleteTask } from "../../actions";
import { getRemainingDays, HoverSegment } from "../../helpers";
import history from "../../history";
import Modal from "../Modal";

class Homework extends Component {
  // constructor(props){
  //   super(props);
  // }
  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }

    // Hier wird die Action ausgelöst,
    // die das To-Do lädt
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
        <div className="ui centered header">
          <h3>
            {task.subject + "-Aufgabe"}
            <div className="ui icon buttons">
              <button
                className="ui icon button"
                id={task.id}
                onClick={() => {
                  history.push(`/homework/homework/${task.id}/delete`);
                }}
              >
                <i className="small trash alternate outline icon"></i>
              </button>
              <button
                className="ui small icon button"
                id={task.id}
                onClick={() => {
                  history.push(`/homework/homework/${task.id}/edit`);
                }}
              >
                <i className="edit icon"></i>
              </button>
            </div>
          </h3>
        </div>
        <HoverSegment
          className="ui segment"
          onClick={() => {
            this.props.markDone(task.id);
          }}
          style={{
            backgroundColor: task.completed ? "grey" : "white"
          }}
        >
          <div>
            <span
              style={{ textAlign: "center", float: "left" }}
              className="meta"
            >
              {remainingDays.time + remainingDays.unit}
            </span>
            <div className="ui header">
              <h3 style={{ textAlign: "center" }}>{task.title}</h3>
            </div>
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
