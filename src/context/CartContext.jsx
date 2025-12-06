// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

// Função para converter várias formas de preço em número seguro
function parsePrice(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;

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

  // qualquer outro tipo -> 0
  return 0;
}

export function CartProvider({ children }) {
  // 🔹 Estado do carrinho (vem do localStorage) - agora normalizamos os preços já na carga
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("cart_items");
      const parsed = stored ? JSON.parse(stored) : [];
      // Normaliza cada item (price como número, quantity como número)
      return parsed.map((it) => ({
        ...it,
        price: parsePrice(it.price),
        quantity: Number(it.quantity) > 0 ? Number(it.quantity) : 1,
      }));
    } catch (err) {
      console.error("Erro ao ler carrinho do localStorage:", err);
      return [];
    }
  });

  // 🔹 Estado do toast
  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  // Sempre que mudar o carrinho, salva no localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart_items", JSON.stringify(items));
    } catch (err) {
      console.error("Erro ao salvar carrinho no localStorage:", err);
    }
  }, [items]);

  // Some o toast sozinho depois de alguns segundos
  useEffect(() => {
    if (!toast.visible) return;
    const id = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 2500);
    return () => clearTimeout(id);
  }, [toast.visible]);

  // Adiciona um produto ao carrinho (normaliza price)
  const addToCart = (product) => {
    const normalizedPrice = parsePrice(product.price);

    setItems((prev) => {
      const existing = prev.find((item) => item.title === product.title);
      if (existing) {
        return prev.map((item) =>
          item.title === product.title
            ? { ...item, quantity: Number(item.quantity) + 1 }
            : item
        );
      }
      // adiciona com price numérico e quantity default 1
      return [
        ...prev,
        {
          ...product,
          price: normalizedPrice,
          quantity: 1,
        },
      ];
    });

    // Mostra toast
    setToast({
      visible: true,
      message: `${product.title} adicionado ao carrinho!`,
    });
  };

  // Remove produto pelo título
  const removeFromCart = (title) => {
    setItems((prev) => prev.filter((item) => item.title !== title));
  };

  // Atualiza quantidade (se <= 0, remove)
  const updateQuantity = (title, quantity) => {
    const q = Number(quantity) || 0;
    if (q <= 0) {
      return removeFromCart(title);
    }
    setItems((prev) =>
      prev.map((item) =>
        item.title === title ? { ...item, quantity: q } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const getTotalItems = () =>
    items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  const getTotalPrice = () =>
    items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}

      {/* Toast global do carrinho */}
      {toast.visible && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1080 }}
        >
          <div className="toast align-items-center text-bg-success border-0 show">
            <div className="d-flex">
              <div className="toast-body">
                <i className="bi bi-check-circle-fill me-2"></i>
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() =>
                  setToast((t) => ({ ...t, visible: false }))
                }
              ></button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de um <CartProvider>");
  }
  return ctx;
}
