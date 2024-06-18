import { configureStore, createSlice } from "@reduxjs/toolkit";

const conf = createSlice({
  name: "conf",
  initialState: {
    item: {},
    show_modal: false
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
    }
  }
})

const store = configureStore({
  reducer: {
    conf: conf.reducer
  }
})

export const { create_item, set_show_modal } = conf.actions;
export default store;