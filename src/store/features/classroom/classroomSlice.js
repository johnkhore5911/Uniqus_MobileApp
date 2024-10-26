import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  title: "",
  subject: "",
  createdBy: "",
  createdAt: "",
  resources: [],
  curriculumStructure: [],
  chapter: [],
  topics: [],
};

const classroomSlice = createSlice({
  name: "classroom",
  initialState,
  reducers: {
    _setClassroomData: (state, action) => {
      state.title = action.payload.title;
      state.subject = action.payload.subject;
      state.createdBy = action.payload.createdBy;
      state.createdAt = action.payload.createdAt;
      state.resources = action.payload.resources;
      state.curriculumStructure = action.payload.curriculumStructure;
      return state;
    },
    _setId: (state, action) => {
      state.id = action.payload.id;
      return state;
    },
    _setTitle: (state, action) => {
      state.title = action.payload.title;
      return state;
    },
    _setSubject: (state, action) => {
      state.subject = action.payload.subject;
      return state;
    },
    _setCreatedBy: (state, action) => {
      state.createdBy = action.payload.createdBy;
      return state;
    },
    _setCreatedAt: (state, action) => {
      state.createdAt = action.payload.createdAt;
      return state;
    },
    _setResources: (state, action) => {
      state.resources = action.payload.resources;
      return state;
    },
    _addNote: (state, action) => {
      state.resources[action.payload.chapterIndex].notes.push(
        action.payload.note
      );
      return state;
    },
    _removeNote: (state, action) => {
      state.resources[action.payload.chapterIndex].notes = state.resources[
        action.payload.chapterIndex
      ].notes.filter((note) => note.id !== action.payload.id);
      return state;
    },
    _addVideo: (state, action) => {
      state.resources[action.payload.chapterIndex].videos.push(
        action.payload.video
      );
      return state;
    },
    _removeVideo: (state, action) => {
      state.resources[action.payload.chapterIndex].videos = state.resources[
        action.payload.chapterIndex
      ].videos.filter((video) => video.id !== action.payload.id);
      return state;
    },
    _addTest: (state, action) => {
      state.resources[action.payload.chapterIndex].tests.push(
        action.payload.test
      );
      return state;
    },
    _removeTest: (state, action) => {
      state.resources[action.payload.chapterIndex].tests = state.resources[
        action.payload.chapterIndex
      ].tests.filter((test) => test.id !== action.payload.id);
      return state;
    },
    _setCurriculumStructure: (state, action) => {
      state.curriculumStructure = action.payload.curriculumStructure;
      return state;
    },
    _addChapter: (state, action) => {
      state.resources.push(action.payload);
      return state;
    },
    _removeChapter: (state, action) => {
      state.resources = state.resources.filter(
        (res) => res.chapterID !== action.payload.chapterId
      );
      return state;
    },
    _resetClassroomData: (state, action) => {
      state.id = "";
      state.title = "";
      state.subject = "";
      state.createdBy = "";
      state.createdAt = "";
      state.resources = [];
      state.curriculumStructure = [];
      state.chapter = [];
      state.topics = [];
      return state;
    },
    setChaptersAndTopics: (state, action) => {
      state.chapter = action.payload.chapter;
      state.topics = action.payload.topics;
      return state;
    },
    setChapters: (state, action) => {
      state.chapter = action.payload.chapter;
      return state;
    },
    setTopics: (state, action) => {
      state.topics = action.payload.topics;
      return state;
    },
  },
});

export const {
  _setClassroomData,
  _resetClassroomData,
  _setId,
  _setTitle,
  _setCreatedAt,
  _setCreatedBy,
  _setCurriculumStructure,
  _setResources,
  _addNote,
  _removeNote,
  _addVideo,
  _removeVideo,
  _addTest,
  _removeTest,
  _setSubject,
  _addChapter,
  _removeChapter,
  setChaptersAndTopics,
  setChapters,
  setTopics,
} = classroomSlice.actions;

export default classroomSlice.reducer;
