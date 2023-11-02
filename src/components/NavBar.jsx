import Logo from "./Logo";

// This is a structural component
export default function NavBar({ children }) {
    return (
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    );
  }