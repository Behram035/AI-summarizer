import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const generateSummary = createAsyncThunk(
  'summary/generate',
  async ({ text, inputType, audioBase64, mimeType }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ text, inputType, audioBase64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error || 'Failed to generate summary');
      return data;
    } catch {
      return rejectWithValue('Network error');
    }
  }
);

export const fetchHistory = createAsyncThunk(
  'summary/fetchHistory',
  async ({ page = 1, limit = 10, search = '' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit, search });
      const res = await fetch(`/api/history?${params}`, {
        headers: getAuthHeader(),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error);
      return data;
    } catch {
      return rejectWithValue('Failed to fetch history');
    }
  }
);

export const deleteSummary = createAsyncThunk('summary/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/history/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.error);
    }
    return id;
  } catch {
    return rejectWithValue('Failed to delete');
  }
});

export const toggleFavorite = createAsyncThunk(
  'summary/toggleFavorite',
  async ({ id, isFavorite }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ isFavorite }),
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.error);
      return data;
    } catch {
      return rejectWithValue('Failed to update');
    }
  }
);

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    // Current session
    inputText: '',
    inputType: 'text', // 'text' | 'audio' | 'voice_note'
    audioBlob: null,
    transcribedText: '',
    currentSummary: null,

    // Loading states
    isGenerating: false,
    isTranscribing: false,

    // History
    history: [],
    historyTotal: 0,
    historyPage: 1,
    historyLoading: false,

    // Errors
    generateError: null,
    historyError: null,

    // UI state
    activeTab: 'summary',
  },
  reducers: {
    setInputText(state, action) {
      state.inputText = action.payload;
    },
    setInputType(state, action) {
      state.inputType = action.payload;
    },
    setAudioBlob(state, action) {
      state.audioBlob = action.payload;
    },
    setTranscribedText(state, action) {
      state.transcribedText = action.payload;
    },
    clearCurrentSummary(state) {
      state.currentSummary = null;
      state.inputText = '';
      state.transcribedText = '';
      state.audioBlob = null;
      state.generateError = null;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    clearGenerateError(state) {
      state.generateError = null;
    },
  },
  extraReducers: (builder) => {
    // Generate Summary
    builder
      .addCase(generateSummary.pending, (state) => {
        state.isGenerating = true;
        state.generateError = null;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.currentSummary = action.payload.summary;
        state.activeTab = 'summary';
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.isGenerating = false;
        state.generateError = action.payload;
      });

    // Fetch History
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload.summaries;
        state.historyTotal = action.payload.total;
        state.historyPage = action.payload.page;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });

    // Delete Summary
    builder.addCase(deleteSummary.fulfilled, (state, action) => {
      state.history = state.history.filter((s) => s._id !== action.payload);
      state.historyTotal = Math.max(0, state.historyTotal - 1);
    });

    // Toggle Favorite
    builder.addCase(toggleFavorite.fulfilled, (state, action) => {
      const idx = state.history.findIndex((s) => s._id === action.payload.summary._id);
      if (idx !== -1) {
        state.history[idx] = action.payload.summary;
      }
    });
  },
});

export const {
  setInputText,
  setInputType,
  setAudioBlob,
  setTranscribedText,
  clearCurrentSummary,
  setActiveTab,
  clearGenerateError,
} = summarySlice.actions;

export default summarySlice.reducer;
