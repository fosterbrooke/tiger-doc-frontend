import { createSlice } from '@reduxjs/toolkit';

interface UserState {
  user: string | null;
  layoutSettings: LayoutSettings
}

interface LayoutSettings {
  headerVisible: boolean;
}

const initialState: UserState = {
  user: null,
  layoutSettings: {
    headerVisible: false
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    showHeader: (state) => {
      state.layoutSettings.headerVisible = true;
    },
    hideHeader: (state) => {
      state.layoutSettings.headerVisible = false;
    }
  },
});

export const {
  setUser,
  clearUser,
  showHeader,
  hideHeader,
} = userSlice.actions;

export default userSlice.reducer;
