import { useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!isDashboard && <Navbar />}

      {children}

      {!isDashboard && <Footer />}
    </>
  );
};

export default Layout;