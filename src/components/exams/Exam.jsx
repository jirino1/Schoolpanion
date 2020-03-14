import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getTasks,
  markDone,
  deleteTask,
  getExam,
  deleteExam
} from "../../actions";
import {
  getRemainingDays,
  HoverSegment,
  sortByCompleted,
  sortById,
  sortByDates
} from "../../helpers";
import history from "../../history";
import Modal from "../Modal";

class Exam extends Component {
  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }

    // Hier wird die Action ausgelöst,
    // die das To-Do lädt
    const { id } = this.props.match.params;
    console.log(id);
    await this.props.getExam(id);
  }

  render() {
    const { exam } = this.props.exams;
    let tasks = this.props.tasks.list;
    const matchID = this.props.match.params.id;
    console.log(exam);
    if (exam === undefined || matchID === "undefined") {
      //Wenn gesuchte Klausur nicht existiert
      return (
        <Modal
          title="Fehler"
          content="Die Klausur die sie suchen existiert nicht"
          onDismiss={() => {
            history.goBack();
          }}
        ></Modal>
      );
    } else if (exam === null || tasks === null || exam.id === matchID) {
      return <div>Lädt...</div>;
    } else {
      tasks = sortByDates(tasks.filter(task => exam.tasks.includes(task.id)));
      return (
        <div className="ui container">
          {/* Header mit Buttons */}
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
                {exam.subject + "-Klausur"}
              </div>
              <span style={{ marginTop: "1px" }} className="ui icon buttons">
                <button
                  style={{ padding: "0.6em", border: "none" }}
                  className="ui icon button"
                  id={exam.id}
                  onClick={() => {
                    history.push(`/exams/exam/${exam.id}/edit`);
                  }}
                >
                  <i className="edit icon"></i>
                </button>
                <button
                  style={{ padding: "0.6em", border: "none" }}
                  className="ui icon button"
                  id={exam.id}
                  onClick={() => {
                    history.push(`/exams/exam/${exam.id}/delete`);
                  }}
                >
                  <i className="trash alternate outline icon"></i>
                </button>
              </span>
            </h1>
          </header>
          {/* Nicht erledigte Sachen zuerst, danach nach ID sortieren */}
          {sortByCompleted(sortById(tasks)).map((task, index) => {
            const remainingDays = getRemainingDays(task.date);
            return (
              <div key={index}>
                <div className="ui horizontal divider header">
                  <h4
                    style={{
                      display: "flex"
                    }}
                  >
                    <div
                      style={{
                        alignSelf: "center",
                        paddingRight: "5px"
                      }}
                      className="left floated content"
                    >
                      {"Aufgabe " + (index + 1)}
                    </div>
                    <button
                      className="ui small icon button"
                      style={{ padding: "0.5em" }}
                      onClick={() => {
                        history.push(`/homework/homework/${task.id}/delete`);
                      }}
                    >
                      <i className="trash alternate outline icon"></i>
                    </button>
                  </h4>
                </div>
                <HoverSegment //wenn Mauszeiger drüber ist, dies visualisieren
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
                <br />
              </div>
            );
          })}
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks,
    exams: state.exams
  };
};

const mapDispatchToProps = {
  getTasks,
  markDone: markDone,
  deleteTask: deleteTask,
  getExam,
  deleteExam
};

export default connect(mapStateToProps, mapDispatchToProps)(Exam);
