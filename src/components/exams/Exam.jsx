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
  sortById
} from "../../helpers";
import history from "../../history";

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
    const tasks = this.props.tasks.list;
    const matchID = this.props.match.params.id;
    console.log(exam);
    if (exam === undefined || matchID === undefined) {
      return <div>The Exam you're searching for doesn't exist</div>;
    } else if (exam === null || tasks === null || exam.id === matchID) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="ui container">
          <div className="ui centered header">
            <h3>
              {exam.subject + "-Exam"}
              <div className="ui icon buttons">
                <button
                  className="ui small icon button"
                  id={exam.id}
                  onClick={() => {
                    history.push(`/exams/exam/${exam.id}/edit`);
                  }}
                >
                  <i className="edit icon"></i>
                </button>
                <button
                  className="ui icon button"
                  id={exam.id}
                  onClick={() => {
                    for (let i = 0; i < exam.tasks.length; i++) {
                      this.props.deleteTask(exam.tasks[i]);
                    }
                    this.props.deleteExam(exam.id);
                    history.push("/exams");
                  }}
                >
                  <i className="small trash alternate outline icon"></i>
                </button>
                {/* MUSS NOCH IN ICON BUTTONS GEMACHT WERDEN */}
              </div>
            </h3>
          </div>

          {sortByCompleted(sortById(tasks)).map((task, index) => {
            const remainingDays = getRemainingDays(task.date);
            return (
              <div key={index}>
                <div className="ui horizontal divider header">
                  <h4>{"Task " + (index + 1)}</h4>
                </div>
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

                <button
                  className="ui right attached icon button"
                  onClick={() => {
                    this.props.deleteTask(task.id);
                  }}
                >
                  <i className="trash alternate outline icon"></i>
                </button>

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
