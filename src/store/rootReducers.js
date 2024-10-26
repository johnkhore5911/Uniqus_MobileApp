// import { combineReducers } from "@reduxjs/toolkit";
// import userReducer from "./features/user/userSlice";
// import ClassroomSlice from './features/classroom/classroomSlice'
// import questionsSlice from './features/Test/TestSlice'
// // import resourcesSlice from './features/resources/resources'
// // Import other slices 

// const rootReducer = combineReducers({
//   user: userReducer,
//   classroom: ClassroomSlice,
//   questionsSlice:questionsSlice

//   // will add other slices here
// });

// export default rootReducer;


import { combineReducers } from "@reduxjs/toolkit";
import { ClassroomSlice, questionsSlice, UserSlice,testSlice,submitSlice } from "./features/featureExporter";
// import TestSlice from "./features/Test/TestSlice";

const rootReducer = combineReducers({
  user: UserSlice,
  classroom: ClassroomSlice,
  // signupData: SignupDataSlice,
  questions : questionsSlice,
  TestingQuestionForm:testSlice,
  submitSlice:submitSlice
});

export default rootReducer;
