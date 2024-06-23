import { configureStore, createSlice } from "@reduxjs/toolkit";

const conf = createSlice({
  name: "conf",
  initialState: {
    item: {},
    show_modal: false,
    show_modal_logout: false,
    show_modal_grup: false,
    show_modal_user: false,
    show_loading: false,
    graph: null
   },
  reducers: {
    create_item: (state, action) => {
      try {
        state.item = action.payload;
      } catch (e) {
        console.log(e.message);
      }
    },
    set_show_modal: (state, action) => {
      state.show_modal = action.payload;
    },
    set_show_logout: (state, action) => {
      state.show_modal_logout = action.payload;
    },
    set_show_grup: (state, action) => {
      state.show_modal_grup = action.payload;
    },
    set_show_user: (state, action) => {
      state.show_modal_user = action.payload;
    },
    set_hide_all_modal: (state) => {
      state.show_modal = false;
      state.show_modal_logout = false;
      state.show_modal_grup = false;
      state.show_modal_user = false;
    },
    set_show_loading: (state, action) => {
      state.show_loading = action.payload;
    },
    set_graph: (state, action) => {
      state.graph = action.payload;
    }
  }
})

const store = configureStore({
  reducer: {
    conf: conf.reducer
  }
})

export const { create_item, set_show_modal, set_show_loading, set_graph, set_show_logout, set_show_user, set_show_grup, set_hide_all_modal } = conf.actions;
export default store;