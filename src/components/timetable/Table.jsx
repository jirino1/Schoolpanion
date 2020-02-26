import React, { Component } from "react";
import { connect } from "react-redux";
import { getTableData, setTableData, getTasks } from "../../actions";
import { startOfToday, startOfWeek, addDays } from "date-fns";

import { Popup } from "semantic-ui-react";
import formatDate from "../../helpers/formatDate";
import { isSameDay } from "date-fns/esm";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      isDoubleClickedArray: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false]
      ]
    };
  }
  async componentDidMount() {
    if (!this.props.table.tableData) {
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
    if (!this.props.table.tableData || !this.props.tasks.list) {
      return <div>Loading...</div>;
    }
    const startWeek = addDays(startOfWeek(startOfToday()), 1);
    console.log(startWeek);
    return (
      <div className={this.props.disabled ? "" : "ui container"}>
        {this.props.disabled ? (
          ""
        ) : (
          <header className="ui header">
            <h1 style={{ textAlign: "center" }}>
              {this.props.disabled ? "" : "My Timetable"}
            </h1>
          </header>
        )}
        <table
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
              return (
                <tr key={index + 1}>
                  <td className="ui collapsing cell" key={0}>
                    <b>{index + 1 + "."}</b>
                    <br />
                    {this.getTableTime(index).time1 +
                      "-" +
                      this.getTableTime(index).time2}
                  </td>
                  {period.map((subject, index) => {
                    const theDay = addDays(startWeek, index);
                    console.log(theDay);
                    const task = this.props.tasks.list.find(
                      t => t.subject === subject
                    );
                    let isDisabled = true;
                    if (task) {
                      console.log(new Date(task.date));
                    }
                    if (task && isSameDay(new Date(task.date), theDay)) {
                      isDisabled = false;
                    }
                    console.log(isDisabled);
                    return (
                      <Popup
                        key={index}
                        content={
                          task ? (
                            <div>
                              <div className="content">
                                <div className="header">
                                  <h3>{task.origin}</h3>
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
                                <input
                                  autoFocus
                                  type="text"
                                  placeholder={"Subject..."}
                                  defaultValue={
                                    this.props.table.tableData[hour][index]
                                      ? this.props.table.tableData[hour][index]
                                      : ""
                                  }
                                  onBlur={async e => {
                                    await this.props.setTableData(
                                      hour,
                                      index,
                                      e.target.value
                                    );
                                    let newDoubleClicks = this.state
                                      .isDoubleClickedArray;
                                    newDoubleClicks[hour][index] = false;
                                    this.setState({
                                      isDoubleClickedArray: newDoubleClicks
                                    });
                                  }}
                                  onKeyPress={async e => {
                                    if (e.key === "Enter") {
                                      await this.props.setTableData(
                                        hour,
                                        index,
                                        e.target.value
                                      );
                                      let newDoubleClicks = this.state
                                        .isDoubleClickedArray;
                                      newDoubleClicks[hour][index] = false;
                                      this.setState({
                                        isDoubleClickedArray: newDoubleClicks
                                      });
                                    }
                                  }}
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
  getTasks
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);
