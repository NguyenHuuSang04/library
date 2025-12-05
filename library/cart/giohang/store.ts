import { configureStore, createSlice } from '@reduxjs/toolkit';

// --- 1. Tạo Slice (Quản lý State) ---
const drinkSlice = createSlice({
  name: 'drinks',
  initialState: { items: [] },
  reducers: {
    setDrinks: (state, action) => {
      state.items = action.payload;
    },
    addDrink: (state, action) => {
      // Thêm vào đầu danh sách
      state.items.unshift(action.payload); 
    },
    // Action gộp: Dùng cho cả Sửa tên/giá và Sửa trạng thái Switch
    updateDrink: (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) {
        // Ghi đè các trường mới vào item cũ
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    // Action Xóa
    deleteDrink: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    }
  }
});

// --- 2. Export ---
export const { setDrinks, addDrink, updateDrink, deleteDrink } = drinkSlice.actions;
export const store = configureStore({
  reducer: {
    drinks: drinkSlice.reducer,
  },
});