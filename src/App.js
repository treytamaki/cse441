import React, {Component} from 'react';
import {connect} from 'react-redux';

import  { useState } from "react";
import * as actions from './actions';
import _ from 'lodash';

import List from './components/List';
import "./App.css";

import { storage } from './config/firebase';

const userType = ["Instructor", "Student"];
const classNames = ["Intermediate Yoga", "Experienced Martial Arts", "Beginner Tai Chi"]

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      chosenClass: null,
      chosenUserType: null,
      movementStatus: false,
    };
  }

  componentWillMount() {
    // this.props.fetchStarts();
    this.checkMovement();    
  }
  
  setName() {
    this.setState({ 
      name: document.getElementById("name").value
    });
  }

  startMovement() {
    const {data} = this.props;
    const {addStart, fetchStarts} = this.props;   
    let pb = fetchStarts();
    let firebaseKey = "";
    let firebaseStatus = false;
    console.log(this.state);
    console.log(this.props);
    _.forEach(data, (value, key) => {      
      if (this.state.chosenClass === value.class) {
        firebaseKey = key;
        firebaseStatus = value.status;
      }
    });

    this.setState({ movementStatus: firebaseStatus});
    addStart({
      firebaseKey: firebaseKey,
      class: this.state.chosenClass,
      status: firebaseStatus,
    });
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
    
    let classes = [];
    classNames.forEach(name => 
      classes.push(<div onClick={() => { this.setState({ chosenClass: name })}} className="blue "
      >
        <h3>
          {name}
        </h3>
      </div>)
    );

    // LOGIN PAGE
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
        </div>
      );
    // CLASS SELECTION
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
    // INSIDE CLASS
    } else {
      // INSTRUCTOR VIEW
      if (this.state.chosenUserType === "Instructor") {
        // LOOK AT STREAM
        if (false) {//this.checkMovement()) {
          return (
            <div>
              <iframe src = "http://localhost:3080"></iframe>
              <button onClick={() => {this.startMovement()}}>Start Movement</button>
              <ul>
                {/* <li><a href= 'http://localhost:8000/stream' >Start Movement</a></li> */}
                {/* <li><a href= 'http://localhost:8000/view'>View Live</a></li> */}
              </ul>
            </div>
          );
        // LOOK AT ALL PHOTOS
        } else {
          console.log("BANANA")
          return (
            <div>
              <div className="container">
                <h3>Welcome {this.state.name}!</h3>
                <h4>Class: {this.state.chosenClass}</h4>
                <List username={this.state.name} 
                      chosenClass={this.state.chosenClass} 
                      userType={this.state.chosenUserType}
                />
              </div>
            </div>
          );
        }
      } else {
      // STUDENT VIEW
        if (this.checkMovement()) {
          // SUBMIT MOVEMENT
          return (
            <div>
              <div className="container">
                <h3>Welcome {this.state.name}!</h3>
                <h4>Class: {this.state.chosenClass}</h4>
                <List username={this.state.name} 
                      chosenClass={this.state.chosenClass} 
                      userType={this.state.chosenUserType}
                />
              </div>
            </div>
          );
        } else {
          return (
            <div>
              <iframe src = "http://localhost:3080"></iframe>
            </div>
          );
        }
      }
    }
  }
}

const mapStateToProps = ({data}) => {
  return {
    data
  }
}

export default connect(mapStateToProps, actions)(App);