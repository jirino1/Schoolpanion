import React from "react";

import { formatDate } from "../../helpers/";
import history from "../../history";

export default function HomeworkCard(props) {
  return (
    <div className={props.isLink ? "ui link card" : "ui card"}>
      <div
        className="content"
        onClick={
          props.isLink
            ? () => {
                history.push(`/homework/homework/${props.task.id}`);
              }
            : () => {}
        }
      >
        <div className="header">{props.task.subject}</div>
        <div className="meta">{"Bis zum " + formatDate(props.task.date)}</div>
        <div className="description">{props.task.title}</div>
      </div>
      <div className="ui bottom attached collapsing small icon buttons">
        <button
          style={
            props.task.completed
              ? { backgroundColor: "grey", border: "none" }
              : { border: "none" }
          }
          className="ui small icon button"
          onClick={async () => {
            await props.owner.props.markDone(props.task.id);
          }}
        >
          <i className="check icon"></i>
        </button>
        <button
          style={{ border: "none" }}
          className="ui small icon button"
          id={props.task.id}
          onClick={() => {
            history.push(`/homework/homework/${props.task.id}/edit`);
          }}
        >
          <i className="edit icon"></i>
        </button>
        <button
          style={{ border: "none" }}
          className="ui small negative icon button"
          id={props.task.id}
          onClick={async () =>
            history.push(`/homework/homework/${props.task.id}/delete`)
          }
        >
          <i className="trash alternate outline icon"></i>
        </button>
      </div>
    </div>
  );
}
