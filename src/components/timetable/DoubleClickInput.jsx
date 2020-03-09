import React from "react";

const DoubleClickInput = React.forwardRef((props, ref) => {
  //Inputs, welche im Falle eines Doppelclicks ausgelöst werden
  let times = props.owner.props.table.times[props.hour];

  return (
    <input
      ref={ref}
      autoFocus={props.autoFocus}
      type={props.type}
      name={props.name}
      placeholder={props.type === "time" ? "HH:MM" : "Fach"}
      defaultValue={props.defaultValue}
      onBlur={async e => {
        if (props.type === "text") {
          await props.owner.props.setTableData(
            props.hour,
            props.index,
            e.target.value
          );
          let newDoubleClicks = props.owner.state.isDoubleClickedArray;
          newDoubleClicks[props.hour][props.index] = false;
          props.owner.setState({
            isDoubleClickedArray: newDoubleClicks
          });
        }
      }}
      onChange={async e => {
        if (props.type === "time") {
          let time =
            props.name === "time1"
              ? {
                  ...times,
                  time1: e.target.value
                }
              : props.name === "time2"
              ? {
                  ...times,
                  time2: e.target.value
                }
              : undefined;
          await props.owner.props.setTimes(props.hour, time);
        }
      }}
      onKeyPress={async e => {
        if (e.key === "Enter") {
          if (props.type === "text") {
            await props.owner.props.setTableData(
              props.hour,
              props.index,
              e.target.value
            );
            let newDoubleClicks = props.owner.state.isDoubleClickedArray;
            newDoubleClicks[props.hour][props.index] = false;
            props.owner.setState({
              isDoubleClickedArray: newDoubleClicks
            });
          } else {
            let newDoubleClicks = props.owner.state.timeDoubleClicks;
            newDoubleClicks[props.hour] = false;
            props.owner.setState({
              timeDoubleClicks: newDoubleClicks
            });
          }
        }
      }}
    />
  );
});
export default DoubleClickInput;
