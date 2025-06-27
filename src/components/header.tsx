import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import {
  setMaxPrice,
  setCategory,
  setSort,
} from "../redux/reducer/filterReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useCategoriesQuery } from "../redux/api/Productapi";
import { CustomError } from "../types/api-types";
import { Button } from "@mui/material";
import { useUpdateUserRoleMutation } from "../redux/api/Userapi";

interface PropsType {
  user: User | null;
}

const defaultCategories = [
  "Electronics",
  "Phone",
  "Laptop",
  "Books",
  "Fashion",
  "Appliances",
  "Furniture",
  "Home Decor",
  "Grocery",
  "Beauty",
  "Toys",
  "Fitness",
  "Shoes",
];

const Header = ({ user }: PropsType) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { category, sort, maxPrice } = useSelector(
    (state: RootState) => state.filter
  );

  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery(undefined);

  const [updateUserRole] = useUpdateUserRoleMutation();

  useEffect(() => {
    if (isError && error) {
      const err = error as CustomError;
      toast.error(err?.data?.message || "Failed to fetch categories.");
    }
  }, [isError, error]);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      setIsUserMenuOpen(false);
      navigate("/login");
    } catch (error) {
      toast.error("Sign out failed");
    }
  };

  const applyFilters = () => {
    const query = new URLSearchParams();
    if (category) query.set("category", category.toLowerCase());
    if (sort) query.set("sort", sort);
    if (maxPrice) query.set("price", maxPrice.toString());
    navigate(`/search?${query.toString()}`);
    setIsDrawerOpen(false);
  };

  const handleCategoryClick = (cat: string) => {
    dispatch(setCategory(cat));
    setIsCategoryOpen(false);
    applyFilters();
  };

  const makeUserAdmin = async () => {
    if (!user?._id) return;
    setIsUpdating(true);
    try {
      const res = await updateUserRole({
        userId: user._id,
        role: "admin",
      }).unwrap();

      toast.success(res.message || "You are now an admin");
      setIsUserMenuOpen(false);
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update role");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <nav className="header">
      <button className="hamburger-btn" onClick={() => setIsDrawerOpen(true)}>
        <FaBars />
      </button>

      <div className="header-right">
        <Link to="/">HOME</Link>
        <Link to="/search">
          <FaSearch />
        </Link>
        <Link to="/cart">
          <FaShoppingBag />
        </Link>

        {user?._id ? (
          <>
            <button onClick={() => setIsUserMenuOpen((prev) => !prev)}>
              <FaUser />
            </button>

            {isUserMenuOpen && (
              <div className="user-menu">
                {user.role === "admin" && (
                  <Link to="/admin/dashboard">
                    <Button variant="outlined" fullWidth>Admin Panel</Button>
                  </Link>
                )}

                {user.role !== "admin" && (
                  <Button
                    onClick={makeUserAdmin}
                    variant="contained"
                    color="secondary"
                    disabled={isUpdating}
                    fullWidth
                  >
                    {isUpdating ? "Updating..." : "Become Admin"}
                  </Button>
                )}

                <Link to="/orders">
                  <Button variant="outlined" fullWidth>Orders</Button>
                </Link>

                <Button
                  onClick={logoutHandler}
                  variant="contained"
                  color="error"
                  startIcon={<FaSignOutAlt />}
                  fullWidth
                  className="user-logout"
                >
                  Logout
                </Button>
              </div>
            )}
          </>
        ) : (
          <Link to="/login">
            <FaSignInAlt />
          </Link>
        )}
      </div>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)}>
          <aside className="drawer" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setIsDrawerOpen(false)}
            >
              ✕
            </button>

            <div className="drawer-section">
              <button
                className="dropdown-toggle"
                onClick={() => setIsCategoryOpen((prev) => !prev)}
              >
                Categories <FaChevronDown />
              </button>

              {isCategoryOpen && (
                <ul className="category-dropdown">
                  {defaultCategories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`category-option ${
                          category?.toLowerCase() === cat.toLowerCase()
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleCategoryClick(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="filter-group">
                <label>Sort</label>
                <select
                  value={sort}
                  onChange={(e) => dispatch(setSort(e.target.value))}
                >
                  <option value="">None</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Max Price: ₹{maxPrice}</label>
                <input
                  type="range"
                  min={100}
                  max={100000}
                  value={maxPrice}
                  onChange={(e) =>
                    dispatch(setMaxPrice(Number(e.target.value)))
                  }
                />
              </div>

              <div>
                <h4>Category</h4>
                <select
                  value={category}
                  onChange={(e) => dispatch(setCategory(e.target.value))}
                >
                  <option value="">All</option>
                  {loadingCategories ? (
                    <option value="" disabled>
                      Loading categories...
                    </option>
                  ) : (
                    categoriesResponse?.categories?.map((cat: string) => (
                      <option key={cat} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </aside>
        </div>
      )}
    </nav>
  );
};

export default Header;
