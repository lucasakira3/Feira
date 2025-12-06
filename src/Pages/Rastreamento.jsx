// src/pages/Rastreamento.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

// Gerar hash blockchain fake
function gerarHashBlockchain(pedido) {
  const base = pedido + Date.now() + Math.random().toString(36).substring(2);
  return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(base))
    .then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    });
}

// Normaliza valores (aceita number | "R$ 10,00" | "10,00" | null | undefined)
function parsePrice(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") {
    return isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    // Remove "R$", espaços, pontos de milhar e troca vírgula por ponto
    const cleaned = value
      .replace("R$", "")
      .replace(/\s+/g, "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

function formatPrice(value) {
  const n = Number(value) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Rastreamento() {
  const [pedido, setPedido] = useState("");
  const [erro, setErro] = useState("");
  const [resultado, setResultado] = useState(null);
  const [blockchainCode, setBlockchainCode] = useState("");
  const [loadingHash, setLoadingHash] = useState(false);

  const etapasPadrao = [
    { key: "prep", label: "Preparação", icon: "bi-box-seam" },
    { key: "sep", label: "Separação", icon: "bi-clipboard-check" },
    { key: "desp", label: "Despache", icon: "bi-truck" },
    { key: "rota", label: "Rota de Entrega", icon: "bi-geo-alt" },
  ];

  function handleRastrear(e) {
    e.preventDefault();

    if (!pedido.trim()) {
      setErro("Digite um número de pedido.");
      return;
    }

    setErro("");

    const lista = JSON.parse(localStorage.getItem("orders")) || [];
    console.log("📦 Lista de pedidos salvos:", lista);

    // Procura pelo pedido correto (usa a chave 'codigo')
    const order = lista.find((o) => {
      if (!o) return false;
      // aceitar tanto 'codigo' quanto 'orderNumber' por segurança (compatibilidade)
      const code = o.codigo ?? o.orderNumber ?? "";
      return String(code) === pedido.trim();
    });

    if (!order) {
      setErro("Pedido não encontrado.");
      setResultado(null);
      return;
    }

    console.log("🔍 Pedido encontrado:", order);

    const dados = {
      status: order.statusText ?? "Pedido confirmado",
      local: order.local ?? "Centro de Distribuição - SP",
      atualizado: "Hoje às " + new Date().toLocaleTimeString("pt-BR"),
      etapasConcluidas: typeof order.status === "number" ? order.status + 1 : order.etapasConcluidas ?? 1,
      pedidoOriginal: order,
    };

    setResultado(dados);

    setLoadingHash(true);
    gerarHashBlockchain(pedido).then((hash) => {
      setBlockchainCode(hash);
      setLoadingHash(false);
    });
  }

  return (
    <>
      <Header />

      <div className="container my-5">
        <h2 className="text-center mb-5">Rastreamento de Pedido</h2>

        <div className="row g-4 justify-content-center">
          {/* FORM */}
          <div className="col-12 col-md-5">
            <form onSubmit={handleRastrear} className="card p-4 shadow-sm">
              <label className="form-label fw-bold">Número do Pedido</label>

              <input
                type="text"
                className="form-control"
                placeholder="Ex: PED-5RA64PJ2"
                value={pedido}
                onChange={(e) => setPedido(e.target.value)}
              />

              {erro && <p className="text-danger mt-2">{erro}</p>}

              <button className="btn btn-success mt-3 w-100" type="submit">
                Rastrear
              </button>
            </form>
          </div>

          {/* RESULTADO */}
          <div className="col-12 col-md-7">
            {resultado && (
              <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between">
                  <h5 className="fw-bold mb-3">Detalhes do Pedido</h5>

                  <div className="text-end">
                    <small className="text-muted">Código blockchain</small>
                    <div className="mt-1">
                      {loadingHash ? (
                        <div className="spinner-border spinner-border-sm" />
                      ) : (
                        <code style={{ wordBreak: "break-all" }}>
                          {blockchainCode || "—"}
                        </code>
                      )}
                    </div>
                  </div>
                </div>

                <p>
                  <strong>Status:</strong> {resultado.status}
                </p>
                <p>
                  <strong>Local:</strong> {resultado.local}
                </p>
                <p>
                  <strong>Última atualização:</strong> {resultado.atualizado}
                </p>

                <hr />

                {/* ETAPAS */}
                <div className="row text-center mb-3">
                  {etapasPadrao.map((etapa, idx) => {
                    const isDone = resultado.etapasConcluidas >= idx + 1;

                    return (
                      <div key={etapa.key} className="col-6 col-md-3 mb-3">
                        <div
                          className={`rounded-circle mx-auto d-flex justify-content-center align-items-center mb-2 ${
                            isDone ? "bg-success text-white" : "border"
                          }`}
                          style={{ width: 50, height: 50 }}
                        >
                          {isDone ? <i className="bi bi-check-lg" /> : <span>{idx + 1}</span>}
                        </div>

                        <i className={`${etapa.icon} fs-4 ${isDone ? "text-success" : "text-muted"}`} />

                        <div className={`fw-bold mt-2 ${isDone ? "text-success" : "text-muted"}`}>
                          {etapa.label}
                        </div>

                        <div className="small text-muted">{isDone ? "Concluído" : "Pendente"}</div>
                      </div>
                    );
                  })}
                </div>

                <hr />

                {/* RESUMO DO PEDIDO */}
                <h6 className="fw-bold">Resumo do Pedido</h6>

                <ul>
                  {resultado.pedidoOriginal.items?.map((item, idx) => {
                    // item.price pode ser number ou string; usamos parsePrice
                    const preco = parsePrice(item.price);
                    const qty = Number(item.quantity) || 1;
                    return (
                      <li key={idx}>
                        {item.title} — {formatPrice(preco)} {qty > 1 && <small className="text-muted">x{qty}</small>}
                      </li>
                    );
                  })}
                </ul>

                <div className="d-flex justify-content-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(parsePrice(resultado.pedidoOriginal.subtotal) || resultado.pedidoOriginal.items?.reduce((s, it) => s + parsePrice(it.price) * (Number(it.quantity) || 1), 0))}</span>
                </div>

                <div className="d-flex justify-content-between">
                  <span>Frete:</span>
                  <span>{formatPrice(parsePrice(resultado.pedidoOriginal.frete) || 0)}</span>
                </div>

                {resultado.pedidoOriginal.desconto ? (
                  <div className="d-flex justify-content-between text-success">
                    <span>Desconto:</span>
                    <span>- {formatPrice(parsePrice(resultado.pedidoOriginal.desconto) || 0)}</span>
                  </div>
                ) : null}

                <hr />

                <div className="d-flex justify-content-between fw-bold">
                  <span>Total calculado:</span>
                  {/* subtotal calculado + frete - desconto */}
                  <span>
                    {formatPrice(
                      (parsePrice(resultado.pedidoOriginal.subtotal) ||
                        resultado.pedidoOriginal.items?.reduce((s, it) => s + parsePrice(it.price) * (Number(it.quantity) || 1), 0) || 0) +
                        parsePrice(resultado.pedidoOriginal.frete) -
                        parsePrice(resultado.pedidoOriginal.desconto)
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="btn btn-outline-secondary">Voltar ao Início</Link>
        </div>
      </div>

      <Footer />
    </>
  );
}
