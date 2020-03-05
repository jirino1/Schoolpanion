import React from "react";
import { connect } from "react-redux";
import Modal from "../Modal";
import history from "../../history";
import { getExam, deleteTask, deleteExam } from "../../actions";

class DeleteExam extends React.Component {
  componentDidMount() {
    this.props.getExam(this.props.match.params.id);
    if (this.props.tasks.list === null) {
      this.props.getTasks();
    }
  }

  renderActions() {
    const { id } = this.props.match.params;

    return (
      <React.Fragment>
        <button
          onClick={() => {
            if (this.props.exams.exam) {
              for (let i = 0; i < this.props.exams.exam.tasks.length; i++) {
                console.log(this.props.exams.exam.tasks[i]);
                this.props.deleteTask(this.props.exams.exam.tasks[i]);
              }
              this.props.deleteExam(id);
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
    if (!this.props.exams.exam) {
      return "Are you sure you want to delete this exam?";
    }

    return `Are you sure you want to delete the ${this.props.exams.exam.subject}-Exam? `;
  }

  render() {
    return (
      <Modal
        title="Delete Exam"
        content={this.renderContent()}
        actions={this.renderActions()}
        onDismiss={() => history.goBack()}
      />
    );
  }
}

const mapStateToProps = state => {
  return { exams: state.exams, tasks: state.tasks };
};

export default connect(mapStateToProps, {
  getExam,
  deleteTask,
  deleteExam
})(DeleteExam);
