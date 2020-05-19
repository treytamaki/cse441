import React, {Component} from 'react';
import {connect} from 'react-redux';
import {completeToDo, fetchAudios} from '../actions';


class ListItem extends Component {
  completeClick = completeTodoId => {
    const {completeToDo} = this.props;
    completeToDo(completeTodoId);
  };

  // componentWillMount() {
  //   this.props.fetchAudios();
  // }

  render() {
    console.log("STate", this.state);
    console.log("Props", this.props);
    
    const{todoId, todo} = this.props;
    return (
      <div key="toDoName" className="col s10 offset-s1 to-do-list-item black">
        <h4>
          {todo.title}
          <span 
            onClick={() => this.completeClick(todoId)}
            className="complete-todo-item waves-effect waves-light blue lighten-5 blue-text text-darken-4 btn"
          >
            <i className="large material-icons">Redo</i>
          </span>
        </h4>
        <img src={todo.photoUrl}/>
        <h6>
          Notes: {todo.comments}
        </h6>
      </div>
    );
  }
}

// const mapStateToProps = ({love}) => {
//   return {
//     love
//   }
// }

export default connect(null, {completeToDo})(ListItem);