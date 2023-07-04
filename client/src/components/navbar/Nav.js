import { NavLink, Link, useNavigate } from "react-router-dom";
import LOGO from "./../../images/BRANDLOGO.png";
import "./Nav.css";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/userAuthSlice";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { setSearchQuery } from "../../store/productsSlice";
const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const user = useSelector((state) => {
    return state.user;
  });
  const [showMenu, setShowMenu] = useState(false);
  const classActiveMenu = showMenu ? "active" : "";
  const hamIcon = showMenu ? "fa-times" : "fa-bars";
  const bag = useSelector((state) => state.cart);
  return (
    <>
      <nav className="nav">
        <div className="nav_left">
          <Link to="/">
            <img src={LOGO} className="brand_logo" alt="brand logo" />
          </Link>
        </div>
        <div className="nav_right">
          <div className="nav_right_searchbar">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(setSearchQuery({ query }));
                if (query.length > 0) navigate(`/products`);
              }}
            >
              <input
                placeholder="search for product,brand and more"
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
              <button type="submit">
                <i class="fa fa-search" aria-hidden="true"></i>
              </button>
            </form>
          </div>
          <ul className={classActiveMenu}>
            {!user?.isAuthenticated && (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/signup">SignUp</NavLink>
                </li>
              </>
            )}

            {user?.isAuthenticated && (
              <li>
                <NavLink to="/profile/overview" title="profile">
                  <i className="fa fa-user" aria-hidden="true"></i>
                  <span className="mobile_view_nav">Profile</span>
                </NavLink>
              </li>
            )}
            {user?.isAuthenticated && (
              <li>
                <NavLink
                  to="/"
                  onClick={() => {
                    dispatch(removeUser());
                    toast.success("logged out");
                  }}
                  title="Logout"
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  <span className="mobile_view_nav">Logout</span>
                </NavLink>
              </li>
            )}
            {user?.user?.role === "naive" && (
              <li>
                <NavLink to="/bag" title="bag">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span className="mobile_view_nav">Bag</span>
                </NavLink>
                <span>{bag?.length === 0 ? "" : bag?.length}</span>
              </li>
            )}
            {user?.user?.role === "admin" && (
              <li>
                <NavLink to="/admin" title="Dashboard">
                  <i class="fas fa-chart-line-down"></i>
                  <span className="mobile_view_nav">Dashboard</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <i
          className={`fa-solid ${hamIcon} hamburger`}
          onClick={(e) => {
            e.preventDefault();
            setShowMenu(!showMenu);
          }}
        ></i>
      </nav>
    </>
  );
};
export default Nav;
