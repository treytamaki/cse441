import React, {Component} from 'react';
import  { useState } from "react";

import List from './components/List';
import "./App.css";

const userType = ["Instructor", "Student"];
const classNames = ["Intermediate Yoga", "Experienced Martial Arts", "Beginner Tai Chi"]

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      chosenClass: null,
      chosenUserType: null
    };
  }
  
  setName() {
    this.setState({ 
      name: document.getElementById("name").value
    });
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

    if (!this.state || this.state.name === null) {
      return (
        <div>
          <h1>Exercise Workshop!</h1>
          <h2 >Username: </h2>
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

    } else {
      if (true) {
        return (
          <div>
            <iframe src="http://localhost:3080/"></iframe>
          </div>
        );
      } else {

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
    }
  }
}
export default App;