// src/pages/Carrinho.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Carrinho() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCart();

  const [itemToRemove, setItemToRemove] = useState(null);

  const total = getTotalPrice ? getTotalPrice() : 0;

  // Formata preço de forma segura
  const formatPrice = (value) => {
    const n = Number(value);
    if (!isFinite(n)) return "R$ 0,00";
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  };

  // Parse seguro que aceita number | "R$10,00" | "10,00" | null | undefined
  const parsePrice = (price) => {
    if (price === null || price === undefined) return 0;

    if (typeof price === "number") {
      // já é número
      return isFinite(price) ? price : 0;
    }

    if (typeof price === "string") {
      // Remove "R$", espaços, pontos de milhar e troca vírgula por ponto
      const cleaned = price
        .replace("R$", "")
        .replace(/\s+/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim();

      const n = parseFloat(cleaned);
      return isNaN(n) ? 0 : n;
    }

    // Qualquer outro tipo
    return 0;
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.title);
      setItemToRemove(null);
    }
  };

  return (
    <>
      <Header />

      <main className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="cart">
            <b>Seu carrinho</b>
          </h1>

          {items.length > 0 && (
            <span className="text-muted">
              {items.length} {items.length === 1 ? "produto" : "produtos"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-5">
            <p className="mb-3">
              Seu carrinho está vazio. Que tal conhecer nossos produtos?
            </p>
            <Link to="/produtos" className="btn btn-success">
              Ver produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="table-responsive mb-4">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th className="text-center">Preço</th>
                    <th className="text-center" style={{ width: "160px" }}>
                      Quantidade
                    </th>
                    <th className="text-center">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const priceNumber = parsePrice(item.price);
                    const qty = Number(item.quantity) || 1;
                    const subtotal = priceNumber * qty;

                    return (
                      <tr key={item.title}>
                        <td>
                          <div className="d-flex align-items-center">
                            {item.img && (
                              <img
                                src={item.img}
                                alt={item.alt || item.title}
                                style={{
                                  width: "64px",
                                  height: "64px",
                                  objectFit: "cover",
                                  borderRadius: "10px",
                                  marginRight: "12px",
                                }}
                              />
                            )}
                            <div>
                              <strong>{item.title}</strong>
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          <span className="valor_venda">
                            {formatPrice(priceNumber)}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex justify-content-center">
                            <div
                              className="input-group input-group-sm"
                              style={{ maxWidth: "150px" }}
                            >
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  updateQuantity(item.title, qty - 1)
                                }
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="form-control text-center"
                                min="1"
                                value={qty}
                                onChange={(e) =>
                                  updateQuantity(
                                    item.title,
                                    Number(e.target.value) || 1
                                  )
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                  updateQuantity(item.title, qty + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          {formatPrice(subtotal)}
                        </td>

                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setItemToRemove(item)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="row g-4 align-items-center">
              <div className="col-md-6 mb-3 mb-md-0">
                <button className="btn btn-outline-danger" onClick={clearCart}>
                  Limpar carrinho
                </button>
                <Link to="/produtos" className="btn btn-outline-success ms-2">
                  Continuar comprando
                </Link>
              </div>

              <div className="col-md-6 text-md-end">
                <p className="mb-1 text-muted">Total da compra</p>
                <h3 className="mb-3">{formatPrice(total)}</h3>
                <Link to="/checkout" className="btn btn-success btn-lg">
                  Ir para o checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* MODAL CUSTOMIZADO PEQUENO */}
      {itemToRemove && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div
            className="card shadow-sm"
            style={{ maxWidth: "400px", width: "90%" }}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Remover produto</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setItemToRemove(null)}
              ></button>
            </div>
            <div className="card-body">
              <p className="mb-0 text-center">
                Tem certeza que deseja remover <b>{itemToRemove.title}</b> do
                carrinho?
              </p>
            </div>
            <div className="card-footer d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setItemToRemove(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmRemove}
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Carrinho;
