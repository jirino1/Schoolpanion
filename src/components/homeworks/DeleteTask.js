import React from "react";
import { connect } from "react-redux";
import Modal from "../Modal";
import history from "../../history";
import { getTask, deleteTask, deleteTaskOfExam } from "../../actions";

class DeleteTask extends React.Component {
  componentDidMount() {
    this.props.getTask(this.props.match.params.id);
  }

  renderActions() {
    const { id } = this.props.match.params;
    const { task } = this.props.tasks;
    return (
      <React.Fragment>
        <button
          onClick={() => {
            if (task) {
              if (task.origin === "exams") {
                this.props.deleteTaskOfExam(task.examID, task.id);
              }
              this.props.deleteTask(id);
              history.goBack();
            }
          }}
          className="ui button negative"
        >
          Delete
        </button>
        <button onClick={() => history.goBack()} className="ui button">
          Cancel
        </button>
      </React.Fragment>
    );
  }

  renderContent() {
    if (!this.props.tasks.task) {
      return "Are you sure you want to delete this task?";
    }

    return `Are you sure you want to delete this ${this.props.tasks.task.subject}-task? `;
  }

  render() {
    return (
      <Modal
        title="Delete Task"
        content={this.renderContent()}
        actions={this.renderActions()}
        onDismiss={() => history.goBack()}
      />
    );
  }
}

const mapStateToProps = state => {
  return { tasks: state.tasks };
};

export default connect(mapStateToProps, {
  getTask,
  deleteTask,
  deleteTaskOfExam
})(DeleteTask);
