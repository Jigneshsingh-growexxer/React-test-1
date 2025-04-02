import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../libs/Axios";

const initialState = {
  products: [],
  currentProduct: null,
  status: "idle",
  error: null,
  total: 0,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/products?_start=${(page - 1) * pageSize}&_limit=${pageSize}`
      );
      const totalResponse = await axios.get(`/products`);
      return {
        data: response.data,
        total: totalResponse.data.length,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/products", productData);
      console.log("Product created successfully", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, product }, { rejectWithValue }) => {
    console.log(id, product);
    try {
      const response = await axios.put(`/products/${id}`, product);
      console.log("Product updated successfully", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`/products/${id}`);
      console.log("Product deleted successfully", res);
      return id;
    } catch (error) {
      console.log("Error deleting product:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// Slice

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add Product
      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const id = action.payload;
        state.products = state.products.filter((product) => product.id !== id);
        state.status = "succeeded";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
