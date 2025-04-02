import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  deleteProduct,
  createProduct,
  updateProduct,
} from "../features/products/ProductSlice";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Modal, Button, Pagination } from "antd";
import ProductForm from "./ProductForm";

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error, total } = useSelector(
    (state) => state.products
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, pageSize }));
  }, [dispatch, currentPage, pageSize]);

  if (status === "loading") {
    return <p className="text-center text-blue-500">Loading...</p>;
  }

  if (status === "failed") {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (productData) => {
    if (modalMode === "add") {
      dispatch(createProduct(productData));
    } else if (modalMode === "edit") {
      dispatch(updateProduct({ id: selectedProduct.id, product: productData }));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Product List</h1>
      <p className="text-lg text-gray-700 text-center mb-4">
        Total Products: <span className="font-semibold">{total}</span>
      </p>
      <Button type="primary" onClick={() => openModal("add")} className="mb-4">
        Add Product
      </Button>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-1">{product.description}</p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Price:</span> ${product.price}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Rating:</span> {product.rating}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-semibold">Availability:</span>{" "}
              {product.isAvailable ? "In Stock" : "Out of Stock"}
            </p>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(product.id)}
              className="mr-2"
            >
              Delete
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => openModal("edit", product)}
              className="mr-2"
            >
              Edit
            </Button>
            <Button
              icon={<EyeOutlined />}
              onClick={() => openModal("view", product)}
            >
              View
            </Button>
          </li>
        ))}
      </ul>

      {/* Pagination Component */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          showTotal={(total) => `Total ${total} products`}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          pageSizeOptions={["5", "10", "20", "50"]}
          showSizeChanger
        />
      </div>

      <Modal
        title={
          modalMode === "add"
            ? "Add Product"
            : modalMode === "edit"
            ? "Edit Product"
            : "View Product"
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <ProductForm
          mode={modalMode}
          product={selectedProduct}
          onSubmit={handleModalSubmit}
        />
      </Modal>
    </div>
  );
};

export default ProductList;
