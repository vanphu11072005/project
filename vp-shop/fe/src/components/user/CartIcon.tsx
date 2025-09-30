import { Link } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { useAppSelector } from "../../hooks";

const CartIcon: React.FC = () => {
  const cart = useAppSelector(state => state.cart.items);

  return (
    <Link to="/cart" className="relative hover:text-pink-600 transition">
      <HiOutlineShoppingCart size={28} />
      {cart.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {cart.length}
        </span>
      )}
    </Link>
  );
}

export default CartIcon;
