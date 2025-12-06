import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function OrderSuccess() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("last_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Erro ao ler pedido salvo:", err);
    }
  }, []);

  // Converte qualquer entrada (number ou string "R$ 5,79" / "5.79" / "5,79") para number
  const parseNumber = (value) => {
    if (value == null) return 0;
    if (typeof value === "number" && !isNaN(value)) return value;

    // Remove "R$", espaços, converte ponto milhar e vírgula decimal para formato JS
    let s = String(value).trim();
    s = s.replace(/\s/g, ""); // remove espaços
    s = s.replace(/^R\$\s?/, ""); // remove R$ se existir
    // Se houver pontos como separador de milhar e vírgula como decimal, converte:
    // Ex: "1.234,56" -> "1234.56"
    if (s.match(/^\d{1,3}(\.\d{3})+,\d{2}$/)) {
      s = s.replace(/\./g, "").replace(/,/g, ".");
    } else {
      // Caso "5,79" -> "5.79"
      s = s.replace(/,/g, ".");
    }
    // Remove qualquer caractere não numérico, ponto ou sinal
    s = s.replace(/[^0-9.\-]/g, "");
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  };

  const formatPrice = (value) =>
    parseNumber(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (isoStr) => {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleCopyCode = () => {
    if (!order) return;
    const code = order.codigo || order.orderNumber || "";
    if (!code) return;
    navigator.clipboard
      .writeText(String(code))
      .then(() => alert("Código copiado: " + code))
      .catch(() => alert("Não foi possível copiar o código."));
  };

  if (!order) {
    return (
      <>
        <Header />
        <main className="container py-5 text-center">
          <h1 className="cart mb-3">
            <b>Nenhum pedido encontrado</b>
          </h1>
          <p className="text-muted mb-4">
            Parece que você ainda não finalizou nenhuma compra nesta sessão.
          </p>
          <Link to="/produtos" className="btn btn-success">
            Ir para a loja
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Suporta ambos os formatos: order.codigo (PED-XXXX) ou order.orderNumber (número)
  const codigoPedido = order.codigo || order.orderNumber || "";

  // Items defensivos
  const items = Array.isArray(order.items) ? order.items : [];

  // Totais defensivos (podem vir como string)
  const subtotal = parseNumber(order.subtotal ?? order.total ?? 0);
  const frete = parseNumber(order.frete ?? 0);
  const desconto = parseNumber(order.desconto ?? 0);
  const total = parseNumber(order.total ?? subtotal + frete - desconto);

  return (
    <>
      <Header />
      <main className="container py-5">
        {/* Cabeçalho do pedido */}
        <div className="mb-4 text-center">
          <p className="text-muted mb-1">
            Pedido{" "}
            {codigoPedido ? (
              <span>
                <strong>#{codigoPedido}</strong>{" "}
                <button
                  className="btn btn-outline-secondary btn-sm ms-2"
                  onClick={handleCopyCode}
                >
                  Copiar código
                </button>
              </span>
            ) : (
              <strong>#{order.orderNumber || ""}</strong>
            )}
          </p>

          <h1 className="cart mb-1">
            <b>Pedido confirmado</b>
          </h1>
          <p className="text-muted">
            Recebemos seu pedido em {formatDate(order.createdAt)}. Enviamos um
            resumo para <b>{order.cliente?.email}</b>.
          </p>
        </div>

        <div className="row g-4">
          {/* Coluna principal - status e itens */}
          <div className="col-lg-8">
            <div className="card p-4 shadow-sm border-0 mb-4">
              <h5 className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-clock-history text-success"></i>
                Status do pedido
              </h5>
              <p className="mb-1">
                <b>Confirmado</b>
              </p>
              <p className="text-muted mb-0">
                Seu pedido foi confirmado e em breve será separado para envio. 🎉
              </p>
            </div>

            <div className="card p-4 shadow-sm border-0">
              <h5 className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-basket text-success"></i>
                Itens do pedido
              </h5>

              <ul className="list-group list-group-flush">
                {items.length === 0 && (
                  <li className="list-group-item">Nenhum item encontrado.</li>
                )}
                {items.map((item, index) => {
                  // item pode ter price numérico ou string
                  const preco = formatPrice(item.price ?? item.preco ?? 0);
                  const quantidade = item.quantity ?? item.qtd ?? item.qty ?? 1;
                  return (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center px-0"
                    >
                      <div>
                        <div className="fw-semibold">{item.title ?? item.nome ?? "Produto"}</div>
                        <small className="text-muted">Quantidade: {quantidade}</small>
                      </div>
                      <span>{preco}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Coluna lateral - resumo + dados do cliente */}
          <div className="col-lg-4">
            <div className="card p-4 shadow-sm border-0 mb-4">
              <h5 className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-receipt-cutoff text-success"></i>
                Resumo do pedido
              </h5>

              <div className="d-flex justify-content-between mb-1">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span>Frete</span>
                <span>{formatPrice(frete)}</span>
              </div>

              {desconto > 0 && (
                <div className="d-flex justify-content-between mb-1 text-success">
                  <span>Desconto</span>
                  <span>- {formatPrice(desconto)}</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Total pago</span>
                <span className="fs-5">{formatPrice(total)}</span>
              </div>

              <p className="small text-muted mb-0">
                Pagamento simulado para fins de demonstração.
              </p>
            </div>

            <div className="card p-4 shadow-sm border-0">
              <h5 className="mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-geo-alt-fill text-success"></i>
                Endereço de entrega
              </h5>
              <p className="mb-1"><b>{order.cliente?.nome}</b></p>
              <p className="mb-1">{order.cliente?.endereco}</p>
              <p className="mb-1">
                {order.cliente?.cidade} - {order.cliente?.estado}
              </p>
              <p className="mb-1">CEP {order.cliente?.cep}</p>
              <p className="mb-3 text-muted">{order.cliente?.telefone}</p>

              <Link to="/" className="btn btn-success w-100">
                Voltar para a Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default OrderSuccess;
