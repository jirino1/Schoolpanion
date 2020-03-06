import React, { Component } from "react";
import { connect } from "react-redux";
import { getTasks, markDone, deleteTask } from "../../actions";
import HomeworkCard from "./HomeworkCard";
import history from "../../history";

class HomeworkList extends Component {
  constructor(props) {
    super(props);
    this.deleteTask = this.deleteTask.bind(this);
  }
  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }
  }

  renderHomeworks(homeworks) {
    if (homeworks.length !== 0) {
      return (
        <div className="ui cards" style={{ padding: "15px" }}>
          {homeworks.map(homework => {
            if (homework.origin === "homework") {
              return (
                <HomeworkCard
                  key={homework.id}
                  task={homework}
                  owner={this}
                  isLink={true}
                />
              );
            }
            return <div key={homework.id} />;
          })}
        </div>
      );
    }
  }

  async deleteTask(event) {
    const id = event.target.id;
    history.push(`/homework/homework/${id}/delete`);
  }

  render() {
    const homeworks = this.props.tasks.list;
    console.log(homeworks);
    if (homeworks === null) {
      return <div>Lädt...</div>;
    }

    return (
      <div className="ui container">
        <div>
          <h1 style={{ paddingLeft: "10px" }}>
            Hausaufgaben
            <div
              className="ui button"
              style={{ marginLeft: "10px" }}
              onClick={() => {
                history.push("/homework/newHomework");
              }}
            >
              Neue Aufgabe
            </div>
          </h1>
        </div>
        <div>{this.renderHomeworks(homeworks)}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { tasks: state.tasks };
};

const mapDispatchToProps = {
  getTasks: getTasks,
  markDone: markDone,
  deleteTask: deleteTask
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeworkList);
