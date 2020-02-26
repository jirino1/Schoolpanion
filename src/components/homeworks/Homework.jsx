import React, { Component } from "react";
import { connect } from "react-redux";

import { getTasks, getTask, markDone, deleteTask } from "../../actions";

import HomeworkCard from "./HomeworkCard";

class Homework extends Component {
  // constructor(props){
  //   super(props);
  // }
  async componentDidMount() {
    if (this.props.tasks.list === null) {
      await this.props.getTasks();
    }

    // Hier wird die Action ausgelöst,
    // die das To-Do lädt
    const { id } = this.props.match.params;
    this.props.getTask(id);
  }

  render() {
    const { task } = this.props.tasks;

    if (task === null) {
      return <div>Loading...</div>;
    }
    if (task === undefined) {
      return <div>The Homework you're searching for doesn't exist</div>;
    }

    return (
      <div className="ui container">
        <HomeworkCard task={task} owner={this} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    tasks: state.tasks
  };
};

const mapDispatchToProps = {
  getTasks,
  getTask,
  markDone: markDone,
  deleteTask: deleteTask
};

export default connect(mapStateToProps, mapDispatchToProps)(Homework);
