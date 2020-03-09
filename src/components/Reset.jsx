import React, { Component } from "react";
import Modal from "./Modal";
import history from "../history";

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = { confirm: false };
  }
  renderActions() {
    //erste Bestätigung
    return (
      <>
        <button
          onClick={() => {
            this.setState({ confirm: true });
          }}
          className="ui negative button"
        >
          Ja
        </button>
        <button
          onClick={() => {
            history.goBack();
          }}
          className="ui button"
        >
          Abbruch
        </button>
      </>
    );
  }
  renderConfirm() {
    //Bestätigung bestätigen
    return (
      <>
        <button
          onClick={() => {
            history.goBack();
          }}
          className="ui button"
        >
          Abbruch
        </button>
        <button
          onClick={() => {
            localStorage.clear();
            history.push("/");
          }}
          className="ui negative button"
        >
          JAAAA
        </button>
      </>
    );
  }
  render() {
    return (
      <div>
        <Modal
          title="App zurücksetzen"
          content={
            this.state.confirm
              ? "Wirklich?"
              : "Sicher, dass du die gesamten Daten, die im lokalen Speicher von der App belegt werden, löschen willst, um die App zurückzusetzen?"
          }
          actions={
            this.state.confirm ? this.renderConfirm() : this.renderActions()
          }
          onDismiss={() => history.goBack()}
        />
      </div>
    );
  }
}

export default Reset;
