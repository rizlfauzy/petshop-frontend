import { configureStore, createSlice } from "@reduxjs/toolkit";

const conf = createSlice({
  name: "conf",
  initialState: {
    item: {},
    show_modal: false,
    show_loading: false,
    graph: {
      data: {},
      options: {}
    }
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

export const { create_item, set_show_modal, set_show_loading, set_graph } = conf.actions;
export default store;