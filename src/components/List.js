import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as actions from '../actions';
import ListItem from './ListItem';
import FeedbackItem from './FeedbackItem';

import "./style.css";

import { storage } from '../config/firebase';

const APP_NAME = "";

class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: true,
      formValue: "",
      photoValue: null
    };
    this.handleChange = this.handleChangeImage.bind(this);
  }

  inputChange = event => {
    this.setState({formValue: event.target.value});
  };

  handleChangeImage = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState({imageTest: image});
    }
  }

  formSubmit = () => {
    const {addToDo} = this.props;    

    const {formValue} = this.state;
    const photo = this.state.imageTest;

    const uploadTask = storage.ref(`images/${photo.name}`).put(photo);
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.setState({progress});
      }, 
      (error) => {
      }, 
    () => {
      storage.ref('images').child(photo.name).getDownloadURL().then(url => {
        const time = new Date() + "";
        addToDo({
          title: this.props.username, 
          className: this.props.chosenClass, 
          photoUrl: url, 
          timestamp: time,
          comments: formValue
        });
        this.setState({formValue: "", imageTest: "", showForm: false});
      })  
    });
  };

  renderForm = () => {
    const {formValue} = this.state;
    return (
      <div id="todo-add-form" className="col s10 offset-s1">
          <div className="input-field">
            <input value={formValue} onChange={this.inputChange} id="toDoNext" type="text"/>
            <input type="file" name="myImage" onChange={this.handleChangeImage} accept="image/*" />
            <button onClick={this.formSubmit}>Upload</button>
            <label htmlFor="toDoNext">Comments</label>
          </div>
      </div>
    );
  };

  renderToDo() {
    const {data} = this.props;

    const username = this.props.username;

    const toDos =[];
    console.log(data);
    _.forEach(data, (value, key) => {
      
      let isInstructor = this.props.userType === "instructor";
      let isStudentAndNamed = !isInstructor && value.title === this.props.username;
      let classIsEqual = this.props.chosenClass === value.className;

      if ((isStudentAndNamed) && classIsEqual) {
        toDos.push(<ListItem key={key} todoId={key} todo={value} />);
      } else if (isInstructor && classIsEqual) {
        toDos.push(<FeedbackItem username={username} key={key} todoId={key} todo={value} />);
      }
    });

    if (!_.isEmpty(toDos)) {
      return toDos;
    } else  {
      return (
        <div>
          {this.renderForm()}
          <div className="col s10 offset-s1 center-align">
            <h4>You have not submitted a photo yet</h4>
          </div>
        </div>
      );
    }
  }

  componentWillMount() {
    this.props.fetchToDos();
  }

  render() {
    const {showForm} = this.state;
    return (
      <div className="to-do-list-container">
        <div className="row">
          {this.renderToDo()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({data}) => {
  return {
    data
  }
}

export default connect(mapStateToProps, actions)(List);