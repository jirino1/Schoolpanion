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
          onClick={async () => {
            if (task) {
              if (task.origin === "exams") {
                await this.props.deleteTaskOfExam(task.examID, task.id);
              }
              await this.props.deleteTask(id);
              history.goBack();
            }
          }}
          className="ui button negative"
        >
          Löschen
        </button>
        <button onClick={() => history.goBack()} className="ui button">
          Abbruch
        </button>
      </React.Fragment>
    );
  }

  renderContent() {
    if (!this.props.tasks.task) {
      return "Sicher, dass du die Aufgabe löschen willst?";
    }

    return `Sicher, dass du die ${this.props.tasks.task.subject}-Aufgabe löschen willst? `;
  }

  render() {
    return (
      <Modal
        title="Aufgabe löschen"
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
