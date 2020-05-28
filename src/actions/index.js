import { databaseRef } from '../config/firebase';
import {FETCH_TODOS} from './types';



const todosRef = databaseRef.child("todos")
const audiosRef = databaseRef.child("audios")
const startsRef = databaseRef.child("starts")

export const addStart = newToDo => async dispatch => {
  console.log(newToDo);
  const classStartRef = databaseRef.child("starts/" + newToDo.firebaseKey);
  startsRef.push().update({
    firebaseKey: newToDo.firebaseKey,
    class: newToDo.class,
    status: !newToDo.status,
  });
};

export const fetchStarts = () => async dispatch => {
  startsRef.on("value", snapshot => {
    dispatch({
      type: FETCH_TODOS,
      payload: snapshot.val()
    });
  });
};

export const addToDo = newToDo => async dispatch => {
  todosRef.push().set(newToDo);
};

export const addFeedback = newToDo => async dispatch => {
  audiosRef.push().set(newToDo);
};

export const completeToDo = completeToDoId => async dispatch => {
  todosRef.child(completeToDoId).remove();
};



export const fetchToDos = () => async dispatch => {
  todosRef.on("value", snapshot => {
    dispatch({
      type: FETCH_TODOS,
      payload: snapshot.val()
    });
  });
};

export const fetchAudios = () => async dispatch => {
  audiosRef.on("value", snapshot => {
    dispatch({
      type: FETCH_TODOS,
      payload: snapshot.val()
    });
  });
};