import { NavLink, Link, useNavigate } from "react-router-dom";
import LOGO from "./../../images/BRANDLOGO.png";
import "./Nav.css";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/userAuthSlice";
import { toast } from "react-hot-toast";
import { useState } from "react";
const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector((state) => {
    return state.user;
  });

  const bag = useSelector((state) => state.cart);
  return (
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
              if (searchQuery.length > 0) navigate(`/search/${searchQuery}`);
            }}
          >
            <input
              placeholder="search for product,brand and more"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <button type="submit">
              <i class="fa fa-search" aria-hidden="true"></i>
            </button>
          </form>
        </div>
        <ul>
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
              <NavLink to="/profile">Profile</NavLink>
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
              >
                Logout
              </NavLink>
            </li>
          )}
          {user?.user?.role === "naive" && (
            <li>
              <NavLink to="/bag">
                <i class="fa-solid fa-cart-shopping"></i>
              </NavLink>
              <span>{bag.length === 0 ? "" : bag.length}</span>
            </li>
          )}
          {user?.user?.role === "admin" && (
            <li>
              <NavLink to="/admin">Dashboard</NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
export default Nav;
