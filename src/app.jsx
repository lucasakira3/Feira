import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./css/global.css";
import "./css/styles.css";
import "./css/login.css";

import Produtos from "./Pages/Produtos.jsx";
import Login from "./Pages/Login.jsx";
import Index from "./Pages/Index.jsx";
import Sobrenos from "./Pages/sobrenos.jsx";
import Cadastro from "./Pages/Cadastro.jsx";
import Faleconosco from "./Pages/FaleConosco.jsx";
import Entrar from "./Pages/Entrar.jsx";
import Carrinho from "./Pages/Carrinho.jsx";
import Checkout from "./Pages/Checkout.jsx";
import OrderSuccess from "./Pages/OrderSuccess";
import Rastreamento from "./Pages/Rastreamento.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sobrenos" element={<Sobrenos />} />
        <Route path="/fale-conosco" element={<Faleconosco />} />
        <Route path="/entrar" element={<Entrar />} />

        {/* As que estavam quebrando */}
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/rastreamento" element={<Rastreamento />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/pedido-confirmado" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
