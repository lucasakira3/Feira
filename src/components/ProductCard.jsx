import { useCart } from "../context/CartContext";

function ProductCard({ image, title, description, price }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      img: image,
      alt: title,
      title,
      text: description,
      price,
    });
  };

  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div className="home-card h-100 d-flex flex-column">
        <img className="home-card-img-top" src={image} alt={title} />

        <div className="home-card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>

          {/* PREÇO + BOTÃO ALINHADOS */}
          <div className="d-flex justify-content-between align-items-center mt-auto w-100">
            <span className="cart fw-bold" style={{ whiteSpace: "nowrap" }}>
              {price}
            </span>

            <button
              type="button"
              className="btn btn-sm btn-success btncard"
              onClick={handleAddToCart}
              style={{ whiteSpace: "nowrap" }}
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
