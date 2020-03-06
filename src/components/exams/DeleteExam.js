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
          Löschen
        </button>
        <button onClick={() => history.goBack()} className="ui button">
          Abbruch
        </button>
      </React.Fragment>
    );
  }

  renderContent() {
    if (!this.props.exams.exam) {
      return "Sind sie sich sicher, dass sie diese Klausur löschen wollen?";
    }

    return `Sind sie sich sicher, dass sie die ${this.props.exams.exam.subject}-Klausur löschen wollen? `;
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
