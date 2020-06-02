import React, {Component} from 'react';
import {connect} from 'react-redux';


import List from './components/List';
import "./App.css";

import _ from 'lodash';

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
      movementStatus: false
    };
  }

  componentWillMount() {
    this.props.fetchStarts();
  }
  
  setName() {
    this.setState({ 
      name: document.getElementById("name").value
    });
  }

  startMovement() {
    const {addStart, fetchStarts} = this.props;
    // fetchStarts();
    const {data} = this.props;
    let firebaseStatus = false;
    console.log(data)
    _.forEach(data, (value, key) => {      
      if (this.state.chosenClass === value.class) {
        firebaseStatus = !value.status;
      }
    });
    addStart({
      classId: classIdForYoga,
      class: this.state.chosenClass,
      status: firebaseStatus,
    });
  }

  getStatusMovement() {
    // const {fetchStarts} = this.props;
    // fetchStarts();
    // console.log("HI")
    const {data} = this.props;
    _.forEach(data, (value, key) => {      
      if (this.state.chosenClass === value.class) {
        return value.status;
      }
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

    // LOGIN
    if (!this.state || this.state.name === null) {
      return (
        <div>
          <h1 >Username: </h1>
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
            <li><a href= 'http://localhost:8000/stream'>Go Live</a></li>
        </ul>
        <iframe src = "http://localhost:8000/view"></iframe>
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
    } else if (!this.getStatusMovement()) {//(this.getStatusMovement()) {
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
      return (
        <div>
          <div className="container">
            <h3>Welcome {this.state.name}!</h3>
            <h4>Class: {this.state.chosenClass}</h4>
            {this.state.chosenUserType === "instructor" && <button onClick={() => {this.startMovement()}}>Start Movement</button>}

            <List username={this.state.name} chosenClass={this.state.chosenClass} userType={this.state.chosenUserType}/>
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

