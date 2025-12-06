// src/pages/Checkout.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import PaymentModal from "../components/PaymentModal";

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const [card, setCard] = useState({
    nomeCartao: "",
    numero: "",
    validade: "",
    cvv: "",
  });

  // frete agora mutável
  const [frete, setFrete] = useState(9.9);
  const [cupom, setCupom] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [parcelas, setParcelas] = useState(1);
  const [cupomMensagem, setCupomMensagem] = useState("");

  const [erro, setErro] = useState("");
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("loading");

  const total = getTotalPrice ? getTotalPrice() : 0;
  const totalFinal = Math.max(total + Number(frete) - Number(desconto), 0);

  const formatPrice = (value) => {
    const n = Number(value) || 0;
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // ==================== HANDLERS ====================

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const aplicarCupom = () => {
    const code = cupom.trim().toUpperCase();

    if (!code) {
      setCupomMensagem("Digite um cupom.");
      setDesconto(0);
      return;
    }

    if (code === "FEIRA10") {
      const valor = total * 0.1;
      setDesconto(valor);
      setCupomMensagem("Cupom FEIRA10 aplicado: 10% OFF.");
    } else if (code === "PRIMEIRA") {
      setDesconto(5);
      setCupomMensagem("Cupom PRIMEIRA aplicado: R$ 5,00 de desconto.");
    } else {
      setDesconto(0);
      setCupomMensagem("Cupom inválido.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nome || !form.email || !form.endereco || !form.cidade) {
      setErro("Preencha nome, e-mail, endereço e cidade.");
      return;
    }

    if (!card.nomeCartao || !card.numero || !card.validade || !card.cvv) {
      setErro("Preencha os dados do cartão.");
      return;
    }

    if (!items.length) {
      setErro("Seu carrinho está vazio.");
      return;
    }

    setErro("");
    setPaymentVisible(true);
    setPaymentStatus("loading");

    // Simulação de pagamento
    setTimeout(() => {
      setPaymentStatus("success");

      // ==================== GERAR CÓDIGO ====================
      const gerarCodigoPedido = () =>
        "PED-" + Math.random().toString(36).substring(2, 10).toUpperCase();

      const codigo = gerarCodigoPedido();

      // ==================== MONTAR PEDIDO ====================
      const orderData = {
        codigo,
        status: 0,
        etapas: ["Preparação", "Separação", "Despache", "Rota de Entrega"],
        items: items.map((item) => ({
          ...item,
          // garante price numérico (CartContext já normaliza, mas aqui é defensivo)
          price: Number(item.price) || 0,
        })),
        subtotal: total,
        frete: Number(frete) || 0,
        desconto: Number(desconto) || 0,
        total: totalFinal,
        cliente: form,
        parcelamento: {
          quantidade: parcelas,
          valorParcela: totalFinal / parcelas,
        },
        createdAt: new Date().toISOString(),
      };

      // Limpa pedidos antigos que não têm 'codigo'
      const oldOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const filtered = oldOrders.filter((o) => o && o.codigo);

      // Salvar
      localStorage.setItem("orders", JSON.stringify([...filtered, orderData]));
      localStorage.setItem("last_order", JSON.stringify(orderData));

      setTimeout(() => {
        clearCart();
        navigate("/pedido-confirmado");
      }, 1200);
    }, 1800);
  };

  // ==================== CARRINHO VAZIO ====================

  if (!items.length) {
    return (
      <>
        <Header />
        <main className="container py-5 text-center">
          <h1 className="cart mb-3"><b>Checkout</b></h1>
          <p className="mb-3">Seu carrinho está vazio.</p>
          <Link to="/produtos" className="btn btn-success">Ver produtos</Link>
        </main>
        <Footer />
      </>
    );
  }

  // ==================== CHECKOUT ====================

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="row g-4">

          {/* FORMULÁRIO */}
          <div className="col-lg-7">
            <h2 className="mb-4">
              <i className="bi bi-credit-card-2-front-fill me-2"></i>
              Checkout
            </h2>

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">

              {erro && (
                <div className="alert alert-danger py-2">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {erro}
                </div>
              )}

              {/* DADOS PESSOAIS */}
              <h5 className="mb-3">
                <i className="bi bi-person-fill text-success me-2"></i>
                Dados do cliente
              </h5>

              <input className="form-control mb-3" placeholder="Nome completo" name="nome" value={form.nome} onChange={handleFormChange} />
              <input className="form-control mb-3" placeholder="E-mail" name="email" value={form.email} onChange={handleFormChange} />
              <input className="form-control mb-3" placeholder="Telefone" name="telefone" value={form.telefone} onChange={handleFormChange} />

              <hr className="my-4" />

              {/* ENDEREÇO */}
              <h5 className="mb-3">
                <i className="bi bi-geo-alt-fill text-success me-2"></i>
                Endereço
              </h5>

              <input className="form-control mb-3" placeholder="Endereço" name="endereco" value={form.endereco} onChange={handleFormChange} />
              <input className="form-control mb-3" placeholder="Cidade" name="cidade" value={form.cidade} onChange={handleFormChange} />
              <input className="form-control mb-3" placeholder="CEP" name="cep" value={form.cep} onChange={handleFormChange} />

              <hr className="my-4" />

              {/* FRETE */}
              <h5 className="mb-3">
                <i className="bi bi-truck text-success me-2"></i>
                Frete
              </h5>

              <div className="mb-3">
                <label className="form-label">Opções de frete</label>
                <select
                  className="form-select"
                  value={frete}
                  onChange={(e) => setFrete(Number(e.target.value))}
                >
                  <option value={9.9}>Econômico — R$ 9,90</option>
                  <option value={19.9}>Expresso — R$ 19,90</option>
                  <option value={0}>Retirada — Grátis</option>
                </select>
              </div>

              <hr className="my-4" />

              {/* PAGAMENTO */}
              <h5 className="mb-3">
                <i className="bi bi-credit-card-fill text-success me-2"></i>
                Pagamento
              </h5>

              <input className="form-control mb-3" placeholder="Nome no cartão" name="nomeCartao" value={card.nomeCartao} onChange={handleCardChange} />

              <div className="row">
                <div className="col-md-8 mb-3">
                  <input className="form-control" placeholder="Número do cartão" name="numero" value={card.numero} onChange={handleCardChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <input className="form-control" placeholder="CVV" name="cvv" value={card.cvv} onChange={handleCardChange} />
                </div>
              </div>

              <input className="form-control mb-3" placeholder="Validade (MM/AA)" name="validade" value={card.validade} onChange={handleCardChange} />

              {/* PARCELAMENTO */}
              <label className="form-label fw-bold">Parcelamento</label>
              <select className="form-select mb-3" value={parcelas} onChange={(e) => setParcelas(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map((p) => (
                  <option key={p} value={p}>
                    {p}x de {formatPrice(totalFinal / p)}
                  </option>
                ))}
              </select>

              <hr className="my-4" />

              {/* CUPOM */}
              <h5 className="mb-2">
                <i className="bi bi-ticket-perforated-fill text-success me-2"></i>
                Cupom de desconto
              </h5>

              <div className="input-group mb-2">
                <input className="form-control" placeholder="Digite o cupom" value={cupom} onChange={(e) => setCupom(e.target.value)} />
                <button type="button" className="btn btn-outline-success" onClick={aplicarCupom}>
                  Aplicar
                </button>
              </div>

              {cupomMensagem && (
                <p className="small text-muted">{cupomMensagem}</p>
              )}

              <button type="submit" className="btn btn-success w-100 mt-4">
                Finalizar Pedido
              </button>
            </form>
          </div>

          {/* RESUMO */}
          <div className="col-lg-5">
            <div className="card p-4 shadow-sm">
              <h5 className="mb-3">
                <i className="bi bi-basket-fill text-success me-2"></i>
                Resumo
              </h5>

              <ul className="list-group mb-3">
                {items.map((item) => (
                  <li key={item.title} className="list-group-item d-flex justify-content-between">
                    <span>{item.title}</span>
                    <span>{formatPrice(Number(item.price) || Number(item.price))}</span>
                  </li>
                ))}
              </ul>

              <div className="d-flex justify-content-between"><span>Subtotal:</span><span>{formatPrice(total)}</span></div>
              <div className="d-flex justify-content-between"><span>Frete:</span><span>{formatPrice(frete)}</span></div>
              <div className="d-flex justify-content-between"><span>Desconto:</span><span>- {formatPrice(desconto)}</span></div>

              <hr />

              <div className="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>{formatPrice(totalFinal)}</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <PaymentModal visible={paymentVisible} status={paymentStatus} />
      <Footer />
    </>
  );
}
