import React, {Component} from 'react';
import {connect} from 'react-redux';
import List from './components/List';
import "./App.css";
import _ from 'lodash';

import { databaseRef } from './config/firebase';
import * as actions from './actions';

const userType = ["instructor", "student"];
const classNames = ["Intermediate Yoga", "Experienced Martial Arts", "Beginner Tai Chi"]

const classIdForYoga = "M8opR64rBwetB1_u2Sw";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      chosenClass: null,
      chosenUserType: null,
      movementStatus: [],
    };
  }

  componentWillMount() {
    let yogaStarts = databaseRef.child("starts").child("-" + classIdForYoga);
    yogaStarts.on("value", snapshot => {
      this.setState({movementStatus: snapshot.val()})
    });

    let audioRef = databaseRef.child("audios");
    audioRef.on("value", snapshot => {
      // this.setState({movementStatus: snapshot.val()})
      this.setState({audios: snapshot.val()})
    });
  }
  
  setName() {
    this.setState({ 
      name: document.getElementById("name").value
    });
  }

  startMovement() {
    const {addStart, fetchStarts} = this.props;
    fetchStarts();
    const {data} = this.props;
    let firebaseStatus = false;    
    _.forEach(data, (value, key) => {      
      if (this.state.chosenClass === value.class) {
        firebaseStatus = value.status;
      }
    });

    addStart({
      classId: classIdForYoga,
      class: this.state.chosenClass,
      status: firebaseStatus,
    });
  }

  getStatusMovement() {
    return this.state.movementStatus.status;
  }

  getAudioFeedback() {
    if (!(this.state.chosenUserType === "student")) {
      return false;
    }
    let audios = this.state.audios;
    

    let currentName = this.state.name;
    let currentClass = this.state.chosenClass;

    let audioUrl = null;

    Object.keys(audios).forEach( function (key) { 
      // console.log(audio);
      
      let fbStudentName = audios[key].student;
      let fbClassName = audios[key].className;

      console.log(fbStudentName === currentName);
      console.log(fbClassName === currentClass);
      if (fbStudentName === currentName && fbClassName === currentClass) {
        audioUrl = audios[key].audioUrl;
      }
    });
    return audioUrl;
  }

  checkMovement() {
    const {data} = this.props;
    const {addStart} = this.props;   
    let firebaseStatus = false;
    _.forEach(data, (value, key) => {
      if (this.state.chosenClass === value.class) {
        firebaseStatus = value.status;
      }
    });
    return firebaseStatus;
  }

  render() {
    console.log("firebaseStatus check", this.state.audios);
    let classes = [];
    classNames.forEach(name => 
      classes.push(<div onClick={() => { this.setState({ chosenClass: name })}} className="blue "
      >
        <h3>
          {name}
        </h3>
      </div>)
    );

    // LOGIN
    if (!this.state || this.state.name === null) {
      return (
        <div>
          <h1>Exercise Workshop!</h1>
          <h3 >Username: </h3>
          <input id="name"/>
            {userType.map(type => (
              <div 
                onClick={() => this.setState({ chosenUserType: type})} 
                className={type === this.state.chosenUserType ? "day active" : "day"}
              >
                {type}
              </div>
            ))}
          <h6 onClick={() => { this.setName()}}>Submit</h6>
          <ul>
            {/* <li><a href= 'http://localhost:8000/stream'>Go Live</a></li> */}
        </ul>
        {/* <iframe src = "http://localhost:8000/stream" allow="camera"></iframe> */}
        </div>
      );
    // SELECT CLASS
    } else if (this.state.chosenClass === null) {
      return (
        <div>
          <h3>Welcome {this.state.name}! {this.state.chosenUserType === "instructor" && " (Instructor)"}</h3>
          <h1 >Select Your Class </h1>
          <div>
            {classes}
          </div>
        </div>
      )
    } else if (this.getStatusMovement()) {//(this.getStatusMovement()) {
      // INSTRUCTOR STREAM VIDEO
      if (this.state.chosenUserType === "instructor") {
        return (
          <div>
            <div className="container">
              <h3>Welcome {this.state.name}!</h3>
              <h4>Class: {this.state.chosenClass}</h4>
              <div>
                <iframe src="http://localhost:8000/stream" allow="camera"></iframe>
              </div>
              <button onClick={() => {this.startMovement()}}>Start Movement</button>
            </div>
          </div>
        );
      // STUDENT STREAM VIDEO
      } else {
        return (
          <div>
            <div className="container">
              <h3>Welcome {this.state.name}!</h3>
              <h4>Class: {this.state.chosenClass}</h4>
              <div>
                <iframe src="http://localhost:8000/view" allow="camera"></iframe>
              </div>
            </div>
          </div>
        );
    
      }
    } else {
      // SEE ALL VIDEOS USER AND INSTRUCTOR
      let audioFeedbackForStudent = this.getAudioFeedback();
      console.log("RENDER AUDIO", audioFeedbackForStudent);
      if (audioFeedbackForStudent) {
        
      }

      return (
        <div>
          <div className="container">
            <h3>Welcome {this.state.name}!</h3>
            <h4>Class: {this.state.chosenClass}</h4>
            {this.state.chosenUserType === "instructor" && <button onClick={() => {this.startMovement()}}>Start Movement</button>}
            <List username={this.state.name} chosenClass={this.state.chosenClass} userType={this.state.chosenUserType} audioUrl={audioFeedbackForStudent}/>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = ({data}) => {
  return {
    data
  }
}

export default connect(mapStateToProps, actions)(App);

