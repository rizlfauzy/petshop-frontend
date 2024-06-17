import { configureStore, createSlice } from "@reduxjs/toolkit";

const conf = createSlice({
  name: "conf",
  initialState: {
    item:{}
   },
  reducers: {
    create_item: (state, action) => {
      try {
        state.item = action.payload;
      } catch (e) {
        console.log(e.message);
      }
    },
  }
})

const store = configureStore({
  reducer: {
    conf: conf.reducer
  }
})

export const { create_item } = conf.actions;
export default store;