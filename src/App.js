import React, { Component } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { bake_cookie, read_cookie, delete_cookie } from "sfcookies";
import Note from "./Note";
import Modal from "./Modal";

const KEY_COOKIE = "NOTES";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      notes: []
    };
  }

  state = {
    show: false
  };
  showModal = (noteModal, indexModal) => {
    this.setState({
      show: !this.state.show,
      note: noteModal,
      index: indexModal
    });
  };

  submit() {
    const { notes, text } = this.state;
    notes.push(text);
    this.setState({ notes });
    bake_cookie(KEY_COOKIE, this.state.notes);
  }

  clear() {
    delete_cookie(KEY_COOKIE);
    this.setState({ notes: [] });
  }

  clearChoose(index) {
    this.state.notes.splice(index, 1);
    const noter = this.state.notes;
    this.setState({ noter });
    bake_cookie(KEY_COOKIE, this.state.notes);
    // window.location.reload(false);
  }

  editChoose(note, index) {
    const notes = read_cookie(KEY_COOKIE);
    notes.splice(index.indexModal, 1, note.noteModal);
    bake_cookie(KEY_COOKIE, notes);
    this.onClose();
    window.location.reload(false);
  }

  componentDidMount() {
    this.setState({ notes: read_cookie(KEY_COOKIE) });
  }

  render() {
    return (
      <div>
        <h2>Lista zakupów</h2>
        <Form inline>
          <FormControl
            onChange={event => this.setState({ text: event.target.value })}
          />
          <Button onClick={() => this.submit()}>Dodaj</Button>
        </Form>
        <Modal
          editChoose={this.editChoose}
          onClose={this.showModal}
          indexModal={this.state.index}
          show={this.state.show}
          noteModal={this.state.note}
        >
          {this.state.note}
        </Modal>
        {this.state.notes.map((note, index) => {
          return (
            <div id="parent">
              <div>
                <Note key={index} note={note} index={index} />
              </div>
              <div className="buttons">
                <Button
                  className="edit"
                  onClick={e => this.showModal(note, index)}
                >
                  Edytuj
                </Button>
                <Button
                  className="delete"
                  onClick={() => this.clearChoose(index)}
                >
                  Usuń
                </Button>
              </div>
            </div>
          );
        })}
        <hr />
        <Button onClick={() => this.clear()}>Wyczyść</Button>
      </div>
    );
  }
}
