import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    selectedQuestions : []
}

const questionSlice = createSlice({
    name: "question",
    initialState: intialState,
    reducers: {
        addSelectedQuestion: (state, action) => {
            state.selectedQuestions.push(action.payload)
        },
        removeSelectedQuestion: (state, action) => {
            state.selectedQuestions = state.selectedQuestions.filter(question => question._id !== action.payload)
        }
    }
});

export const { addSelectedQuestion, removeSelectedQuestion } = questionSlice.actions;
export default questionSlice.reducer