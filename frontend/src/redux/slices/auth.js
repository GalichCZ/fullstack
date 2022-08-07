import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("auth/fetchUser", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

export const fetchLogin = createAsyncThunk("auth/fetchLogin", async () => {
  const { data } = await axios.get("/auth/me");

  return data;
});

export const fetchRegistration = createAsyncThunk(
  "auth/fetchRegistration",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);

    return data;
  }
);

const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: {
    [fetchAuth.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchAuth.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchAuth.pending]: (state) => {
      state.status = "error";
      state.data = null;
    },
    [fetchLogin.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchLogin.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchLogin.pending]: (state) => {
      state.status = "error";
      state.data = null;
    },
    [fetchRegistration.pending]: (state) => {
      state.status = "loading";
      state.data = null;
    },
    [fetchRegistration.fulfilled]: (state, action) => {
      state.status = "loaded";
      state.data = action.payload;
    },
    [fetchRegistration.pending]: (state) => {
      state.status = "error";
      state.data = null;
    },
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions;
