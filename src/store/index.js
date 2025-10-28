import { createStore } from 'redux';

const initialState = {};

function rootReducer(state = initialState, action) {
  return state;
}

export const store = createStore(rootReducer);

