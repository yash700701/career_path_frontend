import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  quizCompleted: false,
  recommendationGenerated: false,
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
    setRecommendationGenerated: (state, action) => {
      state.recommendationGenerated = action.payload.recommendationGenerated;
    },
  },
});

export const { setCredentials, logout, setQuizCompleted, setRecommendationGenerated } = authSlice.actions;
export default authSlice.reducer;
