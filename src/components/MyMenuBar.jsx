import React from "react";
import history from "../history";
export default function MyMenuBar() {
  return (
    <div className="ui inverted top fixed menu">
      <div
        onClick={() => {
          history.goBack();
        }}
        className="link item"
      >
        <i className="large left arrow icon"></i>
      </div>
      <div
        onClick={() => {
          history.push("/");
        }}
        className="link item"
      >
        <i className="large home icon"></i>
      </div>
      <h3 style={{ textAlign: "center" }} className="borderless header item">
        Schoolpanion
      </h3>
      <div
        className="ui simple link dropdown item"
        onClick={() => {
          history.push("/exams");
        }}
      >
        Klausuren
        <i className="dropdown icon"></i>
        <div className="inverted menu">
          <div
            className="inverted link item"
            onClick={e => {
              e.stopPropagation();
              history.push("/exams/newExam");
            }}
          >
            <i className="plus icon"></i>
            hinzufügen...
          </div>
        </div>
      </div>
      <div
        className="ui simple link dropdown item"
        onClick={() => {
          history.push("/homework");
        }}
      >
        Hausaufgaben
        <i className="dropdown icon"></i>
        <div className="inverted menu">
          <div
            className="inverted link item"
            onClick={e => {
              e.stopPropagation();
              history.push("/homework/newHomework");
            }}
          >
            <i className="plus icon"></i>
            Hausaufgaben hinzufügen
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          history.push("/timetable");
        }}
        className="link item"
      >
        Stundenplan
      </div>
      <div className="ui right inverted menu">
        <div
          className="ui simple right floating link icon item"
          onClick={() => {
            history.push("/help");
          }}
        >
          <i className="large question icon" />
        </div>
        <div
          className="ui simple right floating link icon item"
          onClick={() => {
            history.push("/reset");
          }}
        >
          <i className="large red bug icon" />
        </div>
      </div>
    </div>
  );
}
