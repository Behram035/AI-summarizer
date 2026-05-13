import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    authModal: null, // 'login' | 'register' | null
    theme: 'dark',
    notification: null,
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    openAuthModal(state, action) {
      state.authModal = action.payload;
    },
    closeAuthModal(state) {
      state.authModal = null;
    },
    showNotification(state, action) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openAuthModal,
  closeAuthModal,
  showNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
