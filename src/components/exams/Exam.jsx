import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getTasks,
  markDone,
  deleteTask,
  getExam,
  deleteExam
} from "../../actions";
import formatDate from "../../helpers/formatDate";
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
      const { exam } = this.props.exams;
      const tasks = this.props.tasks.list;
      return (
        <div className="ui container">
          <div className="ui card" key={exam.id}>
            <div className="content">
              <div className="header">{exam.subject}</div>
              <div className="meta">{"Till " + formatDate(exam.date)}</div>
              <div className="description">
                <div className="ui relaxed divided list">
                  {exam.tasks.map(task => {
                    const handledTask = tasks.find(t => t.id === task);
                    return (
                      <div key={task} className="item">
                        <div className="content">
                          <button
                            onClick={() => {
                              this.props.markDone(task);
                            }}
                            style={{
                              float: "left",
                              marginRight: "7px",
                              backgroundColor: "white"
                            }}
                            className="ui icon button"
                          >
                            <i
                              className={
                                handledTask.completed
                                  ? "large check square icon"
                                  : "large check square outline icon"
                              }
                            ></i>
                          </button>
                          <div className="header">{handledTask.title}</div>
                          <div className="description">
                            {"Till " + formatDate(handledTask.date)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="ui bottom attached collapsing small icon buttons">
              <button
                className="ui small icon button"
                onClick={() => {
                  history.push(`/exams/exam/${exam.id}/edit`);
                }}
              >
                <i className="edit icon"></i>
              </button>
              <button
                className="ui small icon button"
                id={exam.id}
                onClick={() => {
                  for (let i = 0; i < exam.tasks.length; i++) {
                    this.props.deleteTask(exam.tasks[i]);
                  }
                  this.props.deleteExam(exam.id);
                  history.push("/exams");
                }}
              >
                <i className="trash alternate outline icon"></i>
              </button>
            </div>
          </div>
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
