// import { createSlice } from '@reduxjs/toolkit';
// import { nanoid } from 'nanoid';

// const initialState = {
//     questions: [
//         {
//             id: "", 
//             questionText: "", 
//             questionType: "radio", 
//             options: [ 
//                 { optionText: ""}
//             ],
//             answer: false, 
//             answerKey: null,
//             points: 0, 
//             difficulty: "", 
//             topic: "", 
//             image: null,
//             imageName: "", 
//             topicName: "" 
//         }
//     ],
//     title: "",
//     deadline: "",
//     instructionsArray: [],
//     isScheduled: false,
//     startDateTime: '',
//     testDurationHrs: 0,
//     testDurationMins: 0,
// };

// const questionsSlice = createSlice({
//     name: 'TestingQuestionForm',
//     initialState,
//     reducers: {
//         addQuestion: (state) => {
//             state.questions.push({
//                 id: nanoid(),
//                 questionText: "",
//                 questionType: "radio",
//                 options: [{ optionText: "" }],
//                 answer: false,
//                 answerKey: null,
//                 points: 0,
//                 difficulty: "",
//                 topic: "",
//                 image: null,
//                 imageName: "",
//                 topicName: ""
//             });
//         },

//         updateQuestionText: (state, action) => {
//             const { index, text } = action.payload;
//             console.log(index, text);
//             state.questions[index].questionText = text;
//         },

//         updateOptionText: (state, action) => {
//             const { questionIndex, optionIndex, text } = action.payload;
//             state.questions[questionIndex].options[optionIndex].optionText = text;
//         },
        

//         addOptions: (state, action) => {
//             const { questionIndex } = action.payload;
//             if (state.questions[questionIndex].options.length < 4) {
//                 state.questions[questionIndex].options.push({ optionText: ""});
//             }
//         },

//         removeOptions: (state, action) => {
//             const { questionIndex, optionIndex } = action.payload;
//             console.log(questionIndex, optionIndex);
//             if (state.questions[questionIndex].options.length > 1) {
//                 state.questions[questionIndex].options.splice(optionIndex, 1);
//             }
//         },

//         setAnswerKey: (state, action) => {
//             const { questionIndex, answerKey } = action.payload;
//             console.log(questionIndex, answerKey);
//             state.questions[questionIndex].answerKey = answerKey;
//         },

//         updatePoints: (state, action) => {
//             const { index, points } = action.payload;
//             state.questions[index].points = points;
//         },

//         updateDifficulty: (state, action) => {
//             const { index, difficulty } = action.payload;
//             state.questions[index].difficulty = difficulty;
//         },

//         updateTopic: (state, action) => {
//             const { index, topic , topicName } = action.payload;
//             state.questions[index].topic = topic;
//             state.questions[index].topicName = topicName;
//         },

//         setTitle: (state, action) => {
//             state.title = action.payload;
//         },

//         setDeadline: (state, action) => {
//             state.deadline = action.payload;
//         },

//         addInstruction: (state, action) => {
//             state.instructionsArray.push(action.payload);
//         },

//         removeInstruction: (state, action) => {
//             state.instructionsArray.splice(action.payload, 1);
//         },

//         toggleScheduling: (state) => {
//             state.isScheduled = !state.isScheduled;
//         },

//         setStartDateTime: (state, action) => {
//             state.startDateTime = action.payload;
//         },

//         setTestDurationHrs: (state, action) => {
//             state.testDurationHrs = action.payload;
//         },

//         setTestDurationMins: (state, action) => {
//             state.testDurationMins = action.payload;
//         },

//         setInstructionsArray: (state, action) => {
//             state.instructionsArray = action.payload;
//         },

//         setIsScheduled: (state, action) => {
//             state.isScheduled = action.payload;
//         },

//         resetTestState: (state) => {
//             console.log("Reeset test state")
//             Object.assign(state, initialState);
//         },

//         setQuestions: (state, action) => {
//             state.questions = action.payload;
//         },
//     }
// });

// export const {
//     setIsScheduled,
//     addQuestion,
//     updateQuestionText,
//     updateOptionText,
//     addOptions,
//     removeOptions,
//     setAnswerKey,
//     updatePoints,
//     updateDifficulty,
//     updateTopic,
//     setTitle,
//     setDeadline,
//     addInstruction,
//     removeInstruction,
//     toggleScheduling,
//     setStartDateTime,
//     setTestDurationHrs,
//     setTestDurationMins,
//     resetTestState,
//     setInstructionsArray,
//     setQuestions
// } = questionsSlice.actions;

// export default questionsSlice.reducer;



import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

const initialState = {
    questions: [
        {
            id: "", 
            questionText: "", 
            questionType: "radio", 
            options: [ 
                { optionText: ""}
            ],
            answer: false, 
            answerKey: null,
            points: 0, 
            difficulty: "", 
            topic: "", 
            image: null,
            imageName: "", 
            topicName: "" ,
            response: [],
        }
    ],
    title: "",
    deadline: "",
    instructionsArray: [],
    isScheduled: false,
    startDateTime: '',
    testDurationHrs: 0,
    testDurationMins: 0,
};

const questionsSlice = createSlice({
    name: 'TestingQuestionForm',
    initialState,
    reducers: {
        addQuestion: (state) => {
            state.questions.push({
                id: nanoid(),
                questionText: "",
                questionType: "radio",
                options: [{ optionText: "" }],
                answer: false,
                answerKey: null,
                points: 0,
                difficulty: "",
                topic: "",
                image: null,
                imageName: "",
                topicName: ""
            });
        },

        //update response
        // updateResponse2: (state, action) => {
        //     const { currentQuestionIndex, optionIndex } = action.payload;
        //     console.log("questionIndex: ",currentQuestionIndex);
        //     console.log("optionIndex: ",optionIndex);
        //     console.log("Question in slice: ",state.questions);
        //     state.questions.response = [optionIndex];  // update the response
        // },
        updateResponse2: (state, action) => {
            const { currentQuestionIndex, optionIndex } = action.payload;
            
            // Ensure the index is valid
            console.log("I am inside QuestionSlice");
            console.log("currentQuestionIndex: ",currentQuestionIndex);
            console.log("optionIndex: ",optionIndex);
            console.log("state.questions.questions:",state.questions.questionData);
            console.log("state.questions.questions[currentQuestionIndex]:",state.questions.questionData[currentQuestionIndex]);
            console.log("state.questions.questions[currentQuestionIndex].response[0]:",state.questions.questionData[currentQuestionIndex].response[0]);

            state.questions.questionData[currentQuestionIndex].response[0].response= optionIndex;
            // state.questions.questionData[currentQuestionIndex].response[0].push(optionIndex);
            console.log("Updated!! state.questions.questions[currentQuestionIndex].response.push(optionIndex):",state.questions.questionData[currentQuestionIndex].response[0]);
        },

        clearResponse2: (state, action) => {
            const { questionIndex } = action.payload;

            console.log("I am inside QuestionSlice");
            console.log("currentQuestionIndex: ",questionIndex);
            state.questions.questionData[questionIndex].response[0].response=-1
            state.questions.questionData[questionIndex].response[0].review=false
            console.log("Done")
            // console.log("state.questions.questions:",state.questions.questionData);
            // state.questions.questionData[questionIndex].response[0].review= !state.questions.questionData[questionIndex].response[0].review;

            // if (questionIndex !== undefined) {
            //     // Clear response for a specific question
            //     state.questions[questionIndex].response = [];
            // } else {
            //     // Clear response for all questions if no specific index is provided
            //     state.questions.forEach(question => {
            //         question.response = [];
            //     });
            // }
        },
        
        reviewResponse2: (state, action) => {
            const { questionIndex } = action.payload;

            console.log("I am inside QuestionSlice");
            console.log("currentQuestionIndex: ",questionIndex);
            console.log("state.questions.questions:",state.questions.questionData);
            console.log("I am inside handleClearResponse function, state.questions.questionData[questionIndex].response[0]: ", state.questions.questionData[questionIndex].response[0]);
            
            // state.questions.questionData[questionIndex].response[0].review= !state.questions.questionData[questionIndex].response[0].review;
            state.questions.questionData[questionIndex].response[0].review=!state.questions.questionData[questionIndex].response[0].review;
            console.log("UPDATED! I am inside handleClearResponse function, state.questions.questionData[questionIndex].response[0]: ", state.questions.questionData[questionIndex].response[0]);
            

            // if (questionIndex !== undefined) {
            //     // Clear response for a specific question
            //     state.questions[questionIndex].response = [];
            // } else {
            //     // Clear response for all questions if no specific index is provided
            //     state.questions.forEach(question => {
            //         question.response = [];
            //     });
            // }
        },



        updateQuestionText: (state, action) => {
            const { index, text } = action.payload;
            console.log(index, text);
            state.questions[index].questionText = text;
        },

        updateOptionText: (state, action) => {
            const { questionIndex, optionIndex, text } = action.payload;
            state.questions[questionIndex].options[optionIndex].optionText = text;
        },
        

        addOptions: (state, action) => {
            const { questionIndex } = action.payload;
            if (state.questions[questionIndex].options.length < 4) {
                state.questions[questionIndex].options.push({ optionText: ""});
            }
        },

        removeOptions: (state, action) => {
            const { questionIndex, optionIndex } = action.payload;
            console.log(questionIndex, optionIndex);
            if (state.questions[questionIndex].options.length > 1) {
                state.questions[questionIndex].options.splice(optionIndex, 1);
            }
        },

        setAnswerKey: (state, action) => {
            const { questionIndex, answerKey } = action.payload;
            console.log(questionIndex, answerKey);
            state.questions[questionIndex].answerKey = answerKey;
        },

        updatePoints: (state, action) => {
            const { index, points } = action.payload;
            state.questions[index].points = points;
        },

        updateDifficulty: (state, action) => {
            const { index, difficulty } = action.payload;
            state.questions[index].difficulty = difficulty;
        },

        updateTopic: (state, action) => {
            const { index, topic , topicName } = action.payload;
            state.questions[index].topic = topic;
            state.questions[index].topicName = topicName;
        },

        setTitle: (state, action) => {
            state.title = action.payload;
        },

        setDeadline: (state, action) => {
            state.deadline = action.payload;
        },

        addInstruction: (state, action) => {
            state.instructionsArray.push(action.payload);
        },

        removeInstruction: (state, action) => {
            state.instructionsArray.splice(action.payload, 1);
        },

        toggleScheduling: (state) => {
            state.isScheduled = !state.isScheduled;
        },

        setStartDateTime: (state, action) => {
            state.startDateTime = action.payload;
        },

        setTestDurationHrs: (state, action) => {
            state.testDurationHrs = action.payload;
        },

        setTestDurationMins: (state, action) => {
            state.testDurationMins = action.payload;
        },

        setInstructionsArray: (state, action) => {
            state.instructionsArray = action.payload;
        },

        setIsScheduled: (state, action) => {
            state.isScheduled = action.payload;
        },

        resetTestState: (state) => {
            console.log("Reeset test state")
            Object.assign(state, initialState);
        },

        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
    }
});

export const {
    setIsScheduled,
    addQuestion,
    updateQuestionText,
    updateOptionText,
    addOptions,
    removeOptions,
    setAnswerKey,
    updatePoints,
    updateDifficulty,
    updateTopic,
    setTitle,
    setDeadline,
    addInstruction,
    removeInstruction,
    toggleScheduling,
    setStartDateTime,
    setTestDurationHrs,
    setTestDurationMins,
    resetTestState,
    setInstructionsArray,
    setQuestions,
    clearResponse2, //clear Response
    updateResponse2,  //update Response
    reviewResponse2
} = questionsSlice.actions;

export default questionsSlice.reducer;
