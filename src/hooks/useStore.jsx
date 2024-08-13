import { configureStore, createSlice } from "@reduxjs/toolkit";

const conf = createSlice({
  name: "conf",
  initialState: {
    item: {},
    show_modal: false,
    show_modal_logout: false,
    show_modal_grup: false,
    show_modal_user: false,
    show_modal_satuan: false,
    show_modal_kategori: false,
    show_modal_barang: false,
    show_modal_barang_induk: false,
    show_modal_import: false,
    show_modal_pembelian: false,
    show_modal_penjualan: false,
    show_modal_barang_rusak: false,
    show_modal_barang_rusak_non_approved: false,
    show_modal_repack_barang: false,
    show_modal_qty: false,
    show_loading: false,
    graph: null,
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
    set_show_satuan: (state, action) => {
      state.show_modal_satuan = action.payload;
    },
    set_show_kategori: (state, action) => {
      state.show_modal_kategori = action.payload;
    },
    set_show_barang: (state, action) => {
      state.show_modal_barang = action.payload;
    },
    set_show_barang_induk: (state, action) => {
      state.show_modal_barang_induk = action.payload;
    },
    set_show_import: (state, action) => {
      state.show_modal_import = action.payload;
    },
    set_show_pembelian: (state, action) => {
      state.show_modal_pembelian = action.payload;
    },
    set_show_penjualan: (state, action) => {
      state.show_modal_penjualan = action.payload;
    },
    set_show_barang_rusak: (state, action) => {
      state.show_modal_barang_rusak = action.payload;
    },
    set_show_barang_rusak_non_approved: (state, action) => {
      state.show_modal_barang_rusak_non_approved = action.payload;
    },
    set_show_repack_barang: (state, action) => {
      state.show_modal_repack_barang = action.payload;
    },
    set_show_qty: (state, action) => {
      state.show_modal_qty = action.payload;
    },
    set_hide_all_modal: (state) => {
      state.show_modal = false;
      state.show_modal_logout = false;
      state.show_modal_grup = false;
      state.show_modal_user = false;
      state.show_modal_satuan = false;
      state.show_modal_kategori = false;
      state.show_modal_barang = false;
      state.show_modal_barang_induk = false;
      state.show_modal_import = false;
      state.show_modal_pembelian = false;
      state.show_modal_penjualan = false;
      state.show_modal_barang_rusak = false;
      state.show_modal_barang_rusak_non_approved = false;
      state.show_modal_repack_barang = false;
      state.show_modal_qty = false;
      state.show_loading = false;
    },
    set_show_loading: (state, action) => {
      state.show_loading = action.payload;
    },
    set_graph: (state, action) => {
      state.graph = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    conf: conf.reducer,
  },
});

export const { create_item, set_show_modal, set_show_loading, set_graph, set_show_logout, set_show_user, set_show_grup, set_hide_all_modal, set_show_satuan, set_show_kategori, set_show_barang, set_show_import, set_show_pembelian, set_show_penjualan, set_show_qty, set_show_barang_rusak, set_show_barang_rusak_non_approved, set_show_repack_barang, set_show_barang_induk } = conf.actions;
export default store;
