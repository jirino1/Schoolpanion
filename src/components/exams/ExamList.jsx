import React, { Component } from "react";
import { connect } from "react-redux";

import {
  getExams,
  getTasks,
  markDone,
  deleteTask,
  deleteExam
} from "../../actions";
import history from "../../history";
import { formatDate } from "../../helpers";

class ExamList extends Component {
  async componentDidMount() {
    console.log(this.props.exams);
    if (this.props.exams.list === null) {
      await this.props.getExams();
    }
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
  }

  renderExams() {
    const { list } = this.props.exams;
    const tasks = this.props.tasks.list;
    return (
      // Ui Cards für alle Klausuren
      <div className="ui cards" style={{ padding: "15px" }}>
        {list.map(exam => {
          return (
            <div className="ui link card" key={exam.id}>
              <div
                className="content"
                onClick={() => {
                  history.push(`/exams/exam/${exam.id}`);
                }}
              >
                <div className="header">{exam.subject}</div>
                <div className="meta">{"Bis zum " + formatDate(exam.date)}</div>
                <div className="description">
                  <div className="ui relaxed divided list">
                    {exam.tasks.map(index => {
                      const handledTask = tasks.find(t => t.id === index);
                      return (
                        <div key={index} className="item">
                          <div className="content">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                this.props.markDone(index);
                              }}
                              style={{
                                float: "left",
                                marginRight: "7px",
                                borderStyle: "none",
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
                              {"Bis zum " + formatDate(handledTask.date)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              {/* Buttons an den Cards */}
              <div className="ui bottom attached collapsing small icon buttons">
                <button
                  style={{ border: "none" }}
                  className="ui small icon button"
                  id={exam.id}
                  onClick={() => {
                    history.push(`/exams/exam/${exam.id}/edit`);
                  }}
                >
                  <i className="edit icon"></i>
                </button>
                <button
                  style={{ border: "none" }}
                  className="ui small negative icon button"
                  id={exam.id}
                  onClick={() => {
                    history.push(`/exams/exam/${exam.id}/delete`);
                  }}
                >
                  <i className="trash alternate outline icon"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    console.log(this.props);
    if (this.props.exams.list === null) {
      return <div>Lädt...</div>;
    } else {
      return (
        <div className="ui container">
          <div>
            <header className="ui header">
              <h1 style={{ paddingLeft: "10px" }}>
                Deine Klausuren
                <div
                  className="ui button"
                  style={{ marginLeft: "10px" }}
                  onClick={() => {
                    history.push("/exams/newExam");
                  }}
                >
                  Neue Klausur
                </div>
              </h1>
            </header>
          </div>
          <div>{this.renderExams()}</div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return { exams: state.exams, tasks: state.tasks };
};

const mapDispatchToProps = {
  getExams,
  getTasks,
  markDone,
  deleteTask,
  deleteExam
};

export default connect(mapStateToProps, mapDispatchToProps)(ExamList);
