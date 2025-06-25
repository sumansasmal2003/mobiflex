import { BrowserRouter, Routes, Route } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import ProductDetails from "./pages/ProductDetails"
import Navbar from "./components/Navbar"
import UploadPage from "./pages/UploadPage"

const App = () => {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={ <LandingPage /> } />
        <Route path="/upload_products" element={ <UploadPage /> } />
        <Route path="/product/:productId/:productName" element={ <ProductDetails /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
