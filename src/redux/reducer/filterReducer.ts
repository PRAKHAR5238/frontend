import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Initial State
const initialState: any = {
  maxPrice: 100000,
  category: "",
  sort: "",
};

export const FilterReducer = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setMaxPrice: (state, action: PayloadAction<number>) => {
      state.maxPrice = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload;
    },

    resetFilter: () => ({
      ...initialState,
    }),
  },
});

// Export actions
export const { setMaxPrice, setCategory, setSort, resetFilter } =
  FilterReducer.actions;

// Export reducer
export default FilterReducer.reducer;
