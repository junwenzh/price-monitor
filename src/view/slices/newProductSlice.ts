import { createSlice } from '@reduxjs/toolkit';

export const newProductSlice = createSlice({
  name: 'productTracking',
  initialState: {
    url: 'https://www.fragrancenet.com/perfume/dolce-and-gabbana/d-and-g-light-blue/edt#118661',
    img: '',
    coordinates: { x: 0, y: 0 },
    offsetCoords: { x: 0, y: 0 },
    showConfirmation: false,
    showPriceForm: false,
    price: 0,
    selector: '',
    target_price: '',
    user_note: '',
    showPostSubmitOptions: false,
  },
  reducers: {
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setImg: (state, action) => {
      state.img = action.payload;
    },
    setCoordinates: (state, action) => {
      state.coordinates = action.payload;
    },
    setOffsetCoords: (state, action) => {
      state.offsetCoords = action.payload;
    },
    toggleConfirmation: (state, action) => {
      state.showConfirmation = action.payload;
    },
    togglePriceForm: (state, action) => {
      state.showPriceForm = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setSelector: (state, action) => {
      state.selector = action.payload;
    },
    setTargetPrice: (state, action) => {
      state.target_price = action.payload;
    },
    setUserNote: (state, action) => {
      state.user_note = action.payload;
    },
    togglePostSubmitOptions: (state, action) => {
      state.showPostSubmitOptions = action.payload;
    },
  },
});

export const {
  setUrl,
  setImg,
  setCoordinates,
  setOffsetCoords,
  toggleConfirmation,
  togglePriceForm,
  setPrice,
  setSelector,
  setTargetPrice,
  setUserNote,
  togglePostSubmitOptions,
} = newProductSlice.actions;

export default newProductSlice.reducer;
