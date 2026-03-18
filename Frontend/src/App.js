import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import "./App.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/product.css';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </>
  );
}

export default App;
