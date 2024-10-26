// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//     responses: [], // Array of objects: { questionId, selectedOption }
// };

// const submitSlice = createSlice({
//     name: 'submit',
//     initialState,
//     reducers: {
//         updateResponse: (state, action) => {
//             const { questionId, selectedOption } = action.payload;
//             const existingResponse = state.responses.find(response => response.questionId === questionId);
//             console.log("I am in Submitslice i am updating")

//             if (existingResponse) {
//                 // Update the existing response
//                 existingResponse.selectedOption = selectedOption;
//             } else {
//                 // Add a new response
//                 state.responses.push({ questionId, selectedOption });
//             }
//         },
//         clearResponse: (state, action) => {
//             const { questionId } = action.payload;
//             // Remove the response for the specified questionId
//             state.responses = state.responses.filter(response => response.questionId !== questionId);
//         },
//         resetResponses: (state) => {
//             state.responses = []; // Reset all responses
//         }
//     }
// });

// // Export actions
// export const { updateResponse, resetResponses,clearResponse } = submitSlice.actions;

// // Export the reducer
// export default submitSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    responses: [], // Array of objects: { questionId, selectedOption }
};

const submitSlice = createSlice({
    name: 'submit',
    initialState,
    reducers: {
        updateResponse: (state, action) => {
            const { questionId, selectedOption } = action.payload;
            const existingResponse = state.responses.find(response => response.questionId === questionId);
            console.log("I am in Submitslice i am updating")

            if (existingResponse) {
                // Update the existing response
                existingResponse.response = selectedOption;
            } else {
                // Add a new response
                state.responses.push({ questionId, response:selectedOption });
            }
        },
        clearResponse: (state, action) => {
            const { questionId } = action.payload;
            // Remove the response for the specified questionId
            state.responses = state.responses.filter(response => response.questionId !== questionId);
        },
        resetResponses: (state) => {
            state.responses = []; // Reset all responses
        }
    }
});

// Export actions
export const { updateResponse, resetResponses,clearResponse } = submitSlice.actions;

// Export the reducer
export default submitSlice.reducer;
