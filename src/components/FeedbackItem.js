import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addFeedback} from '../actions';

import { storage } from '../config/firebase';

import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class FeedbackItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
  }

  

  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }


  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    const {addFeedback} = this.props;    
    

    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.setState({ blobURL, isRecording: false });
        
        const audioFileName = this.props.username + "-" + this.props.todo.title + "-" + this.props.todo.className + "-" + this.props.todo.timestamp;

        const uploadTask = storage.ref(`audios/${audioFileName}`).put(blob);
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState({progress});
          }, 
          (error) => {
            console.log(error);
          }, 
        () => {
          storage.ref('audios').child(audioFileName).getDownloadURL().then(url => {
            console.log(this.state);
            const time = new Date() + "";
            
            addFeedback({
              instructor: this.props.username, 
              student: this.props.todo.title,
              className: this.props.todo.className, 
              audioUrl: url, 
              timestamp: time,
            });

            this.setState({
              isRecording: false,
              blobURL: '',
              isBlocked: false
            });
          })  
        });

      }).catch((e) => console.log(e));
  };

  completeClick = completeTodoId => {
    // const {completeToDo} = this.props;
    // completeToDo(completeTodoId);
  };

  render() {
    const{todoId, todo} = this.props;
    return (
      <div key="toDoName" className="col s10 offset-s1 to-do-list-item black">
        <h4>
          {todo.title}
          <span 
            onClick={() => this.completeClick(todoId)}
            className="complete-todo-item waves-effect waves-light blue lighten-5 blue-text text-darken-4 btn"
          >

            <button className="large material-icons" onClick={this.start} disabled={this.state.isRecording}>Record</button>
            <button className="large material-icons" onClick={this.stop} disabled={!this.state.isRecording}>Stop</button>

            {/* /* <RecordButton isRecording={this.state.isRecording}/>  */}
          </span>
        </h4>

        {/* <audio src={this.state.blobURL} controls="controls" /> */}

        <img src={todo.photoUrl}/>
        <h6>
          Notes: {todo.comments}
        </h6>
      </div>
    );
  }
}



export default connect(null, {addFeedback})(FeedbackItem);