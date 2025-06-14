
import { FaExpandAlt, FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom"; // ✅ Correct import

type ProductProps = {
  productId: string;
  name: string;
  price: number;
  stock: number;
  photo: string;
  handler: (cartitem: CartItem) => void;
  server: string;
};

const ProductCard = ({
  productId,
  name,
  price,
  stock,
  photo,
  handler,
  server,
}: ProductProps) => {
  const handleAddToCart = () => {
    handler({
      productId,
      price,
      name,
      stock,
      quantity: 1,
      photo,
      _id: productId,
      id: Date.now(),
    });
  };

  return (
    <div className="productcard">
      <img src={`${server}${photo}`} alt={`Image of ${name}`} />
      <h2>{name}</h2>
      <p>Price: ${price}</p>

      <span className={stock === 0 ? "out-of-stock" : ""}>
        {stock === 0 ? "Out of Stock" : `${stock} in stock`}
      </span>

      {stock > 0 && (
        <div className="actions">
          <button onClick={handleAddToCart} aria-label="Add to Cart">
            <FaPlus />
          </button>
          <Link  to={`/product/${productId}`} className="details-link" aria-label="View Details">
            <FaExpandAlt />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
