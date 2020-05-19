import { databaseRef } from '../config/firebase';
import {FETCH_TODOS} from './types';

const todosRef = databaseRef.child("todos")
const audiosRef = databaseRef.child("audios")

export const addToDo = newToDo => async dispatch => {
  console.log(newToDo);
  todosRef.push().set(newToDo);
};

export const addFeedback = newToDo => async dispatch => {
  console.log(newToDo);
  audiosRef.push().set(newToDo);
};

export const completeToDo = completeToDoId => async dispatch => {
  console.log(completeToDoId);
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