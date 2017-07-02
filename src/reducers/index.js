import board from "./board";
import turn from "./turn";
import instructions from "./instructions";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
  board,
  turn,
  instructions
});
export default rootReducer;
