import React, { Component } from "react";
import { connect } from "react-redux";
import { getTableData, setTableData, getTasks, setTimes } from "../../actions";
import { startOfToday, startOfWeek, addDays } from "date-fns";
import { isSameDay } from "date-fns/esm";
import { Popup } from "semantic-ui-react";

import { formatDate, generateFalseArray } from "../../helpers";
import DoubleClickInput from "./DoubleClickInput";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"],
      isDoubleClickedArray: generateFalseArray(11, 5), //11 Stunden, 5 Tage => Array mit 11x5 falsch, wenn ein Feld true ist, soll dort ein Input erscheinen
      timeDoubleClicks: generateFalseArray(11, 1) //11 Stunden => 11x1 Array
    };
  }
  async componentDidMount() {
    if (!this.props.table.tableData || !this.props.table.times) {
      await this.props.getTableData();
    }
    if (!this.props.tasks.list) {
      await this.props.getTasks();
    }
  }
  render() {
    if (
      !this.props.table.tableData ||
      !this.props.tasks.list ||
      !this.props.table.times
    ) {
      return <div>Lädt...</div>;
    }
    const startWeek = addDays(startOfWeek(startOfToday()), 1); //Berechne den Anfangstag der aktuellen Woche
    return (
      // wenn Tabelle lediglich Inhalte darstellen soll, dann ist sie disabled
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
          //wenn man auf die Tabelle klickt, werden die Inputs deaktiviert
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
            {/* Wochentage als Überschriften */}
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
                        //wenn man auf das Feld mit Input klickt, soll dieser Input nicht deaktiviert werden
                      }
                    }}
                    className="ui cell"
                    key={0}
                    onDoubleClick={
                      //Aktiviere den Input, auf dessen Feld doubleclicked wurde
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
                    {this.state.timeDoubleClicks[hour] ? (
                      <div
                        style={{ width: "90%", height: "30%" }}
                        className="ui small inputs"
                      >
                        {/* Zwei Inputs, Start- und Endzeit */}
                        <DoubleClickInput
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
                        {/* Wenn keine Zeiten definiert sind, ??? einblenden */}
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
                    //Wenn an einem Tag eine Aufgabe existiert, wessen Fach man an dem Tag auch hätte, soll Popup aktiviert werden
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
                            //Das Popup soll Datum, Fach und Titel beinhalten
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
                          //Die Zelle der Tabelle soll Popup auslösen
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
