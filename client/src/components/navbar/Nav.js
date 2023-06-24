import { NavLink, Link } from "react-router-dom";
import LOGO from "./../../images/BRANDLOGO.png";
import "./Nav.css";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../../store/userAuthSlice";
import { toast } from "react-hot-toast";
const Nav = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.user;
  });
  return (
    <nav className="nav">
      <div className="nav_left">
        <Link to="/">
          <img src={LOGO} className="brand_logo" alt="brand logo" />
        </Link>
      </div>
      <div className="nav_right">
        <div className="nav_right_searchbar">
          <input placeholder="search for product,brand and more" />
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
          <li>
            <NavLink to="/wishlist">Wishlist</NavLink>
          </li>
          <li>
            <NavLink to="/bag">Bag</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Nav;
