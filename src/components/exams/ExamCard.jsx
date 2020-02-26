import React from "react";

import formatDate from "../../helpers/formatDate";
import history from "../history";

export default function ExamCard(props) {
  return (
    <div className={props.isLink ? "ui link card" : "ui card"}>
      <div
        className="content"
        onClick={
          props.isLink
            ? () => {
                history.push(`/exams/exam/${props.exam.id}`);
              }
            : () => {}
        }
      >
        <div className="header">{props.exam.subject}</div>
        <div className="meta">{"Till " + formatDate(props.exam.date)}</div>
        <div className="description">
          <div className="ui relaxed divided list">
            {props.exam.tasks.map(index => {
              console.log(index);
              const handledTask = props.tasks.find(t => t.id === index);
              return (
                <div key={index} className="item">
                  <div className="content">
                    <button
                      onClick={() => {
                        props.owner.props.markDone(index);
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
            history.push(`/exams/exam/${props.exam.id}/edit`);
          }}
        >
          <i className="edit icon"></i>
        </button>
        <button
          className="ui small icon button"
          id={props.exam.id}
          onClick={() => {
            for (let i = 0; i < props.exam.tasks.length; i++) {
              props.owner.props.deleteTask(props.exam.tasks[i]);
            }
            props.owner.props.deleteExam(props.exam.id);
            history.push("/exams");
          }}
        >
          <i className="trash alternate outline icon"></i>
        </button>
      </div>
    </div>
  );
}
