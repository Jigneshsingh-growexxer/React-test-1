import "./App.css";
import ProductForm from "./component/ProductForm";
import ProductList from "./component/ProductList";

function App() {
  return (
    <div style={{ flex: "0 0 60%", padding: "10px" }}>
      <ProductList />
    </div>
  );
}

export default App;
