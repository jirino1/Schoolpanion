import React, { Component } from "react";
import { connect } from "react-redux";
import { getTableData, setTableData, getTasks, setTimes } from "../../actions";
import { startOfToday, startOfWeek, addDays } from "date-fns";
// import TimePicker from "react-time-picker";
import { isSameDay } from "date-fns/esm";
import { Popup } from "semantic-ui-react";

import { formatDate, generateFalseArray } from "../../helpers";
import DoubleClickInput from "./DoubleClickInput";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"],
      isDoubleClickedArray: generateFalseArray(11, 5),
      timeDoubleClicks: generateFalseArray(11, 1)
    };
    this.refOne = React.createRef();
    this.refTwo = React.createRef();
  }
  async componentDidMount() {
    if (!this.props.table.tableData || !this.props.table.times) {
      await this.props.getTableData();
    }
    if (!this.props.tasks.list) {
      await this.props.getTasks();
    }
  }
  getTableTime(index) {
    let time1 = 8 + 0.75 * index;
    let time2 = 8 + 0.75 * (index + 1);
    let time1minutes = (time1 - Math.floor(time1)) * 60;
    if (time1minutes === 0) {
      time1minutes = "00";
    }
    time1 = Math.floor(time1) + ":" + time1minutes;
    let time2minutes = (time2 - Math.floor(time2)) * 60;
    if (time2minutes === 0) {
      time2minutes = "00";
    }
    time2 = Math.floor(time2) + ":" + time2minutes;
    return { time1, time2 };
  }
  render() {
    if (
      !this.props.table.tableData ||
      !this.props.tasks.list ||
      !this.props.table.times
    ) {
      return <div>Lädt...</div>;
    }
    const startWeek = addDays(startOfWeek(startOfToday()), 1);
    return (
      <div className={this.props.disabled ? "" : "ui container"}>
        {this.props.disabled ? (
          ""
        ) : (
          <header className="ui header">
            <h1 style={{ textAlign: "center" }}>
              {this.props.disabled ? "" : "Mein Stundenplan"}
            </h1>
          </header>
        )}
        <table
          onClick={e =>
            this.setState({
              isDoubleClickedArray: generateFalseArray(11, 5),
              timeDoubleClicks: generateFalseArray(11, 1)
            })
          }
          style={{ textAlign: "center" }}
          className="ui unstackable fixed celled table"
        >
          <thead className="ui cell">
            <tr>
              <th key={0}></th>
              {this.state.days.map((day, index) => {
                return <th key={index + 1}>{day}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.table.tableData.map((period, index) => {
              let hour = index;
              let times = this.props.table.times[hour];

              return (
                <tr key={index + 1}>
                  <td
                    onClick={e => {
                      if (this.state.timeDoubleClicks[hour]) {
                        e.stopPropagation();
                      }
                    }}
                    className="ui cell"
                    key={0}
                    onDoubleClick={
                      this.props.disabled
                        ? undefined
                        : () => {
                            let newDoubleClicks = this.state.timeDoubleClicks;
                            newDoubleClicks[hour] = true;
                            this.setState({
                              timeDoubleClicks: newDoubleClicks
                            });
                          }
                    }
                  >
                    <b>{index + 1 + "."}</b>
                    <br />
                    {/* {this.getTableTime(index).time1 +
                      "-" +
                      this.getTableTime(index).time2} */
                    this.state.timeDoubleClicks[hour] ? (
                      <div
                        style={{ width: "90%", height: "30%" }}
                        className="ui small inputs"
                      >
                        <DoubleClickInput
                          ref={this.refOne}
                          autoFocus
                          type="time"
                          name={"time1"}
                          defaultValue={times ? times.time1 : ""}
                          owner={this}
                          hour={hour}
                        />
                        <br />
                        <div>-</div>
                        <DoubleClickInput
                          ref={this.refTwo}
                          className="ui small input"
                          type="time"
                          name={"time2"}
                          defaultValue={times ? times.time2 : ""}
                          owner={this}
                          hour={hour}
                        />
                      </div>
                    ) : (
                      <div>
                        {times && times.time1 && times.time2
                          ? times.time1 + " - " + times.time2
                          : "???"}
                      </div>
                    )}
                  </td>
                  {period.map((subject, index) => {
                    const theDay = addDays(startWeek, index);
                    const task = this.props.tasks.list.find(
                      t => t.subject === subject
                    );
                    let isDisabled = true;
                    if (task) {
                    }
                    if (task && isSameDay(new Date(task.date), theDay)) {
                      isDisabled = false;
                    }
                    return (
                      <Popup
                        key={index}
                        content={
                          task ? (
                            <div>
                              <div className="content">
                                <div className="header">
                                  <h3>
                                    {task.origin === "homework"
                                      ? "Hausaufgabe"
                                      : `${task.subject}-Klausuraufgabe`}
                                  </h3>
                                </div>
                                <span
                                  style={{
                                    color: "darkgrey",
                                    fontSize: "10pt"
                                  }}
                                >
                                  {"Till " + formatDate(task.date)}
                                </span>
                                <div className="description">{task.title}</div>
                              </div>
                            </div>
                          ) : (
                            <div></div>
                          )
                        }
                        disabled={isDisabled}
                        trigger={
                          <td
                            onClick={e => {
                              if (
                                this.state.isDoubleClickedArray[hour][index]
                              ) {
                                e.stopPropagation();
                              }
                            }}
                            style={
                              isDisabled
                                ? {}
                                : {
                                    backgroundColor: "yellow",
                                    border: "1pt solid red"
                                  }
                            }
                            className="ui collapsing cell"
                            key={index + 1}
                            onDoubleClick={
                              this.props.disabled
                                ? undefined
                                : () => {
                                    let newDoubleClicks = this.state
                                      .isDoubleClickedArray;
                                    newDoubleClicks[hour][index] = true;
                                    this.setState({
                                      isDoubleClickedArray: newDoubleClicks
                                    });
                                  }
                            }
                          >
                            {this.state.isDoubleClickedArray[hour][index] ? (
                              <div
                                style={{ width: "100%" }}
                                className="ui input"
                              >
                                <DoubleClickInput
                                  autoFocus
                                  type="text"
                                  defaultValue={
                                    this.props.table.tableData[hour][index]
                                      ? this.props.table.tableData[hour][index]
                                      : ""
                                  }
                                  hour={hour}
                                  index={index}
                                  owner={this}
                                />
                              </div>
                            ) : (
                              <div>{subject ? subject : "---"}</div>
                            )}
                          </td>
                        }
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
const mapStateToProps = state => {
  //console.log(state);

  return { table: state.table, tasks: state.tasks };
};

const mapDispatchToProps = {
  getTableData,
  setTableData,
  getTasks,
  setTimes
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
