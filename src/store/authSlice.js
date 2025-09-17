import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  quizId: null,
  quizCompleted: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setQuizCompleted: (state, action) => {
      state.quizCompleted = action.payload.quizCompleted;
    },
  },
});

export const { setCredentials, logout, setQuizCompleted } = authSlice.actions;
export default authSlice.reducer;
