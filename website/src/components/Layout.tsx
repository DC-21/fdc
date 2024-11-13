import React, { ReactNode } from "react";
import Navbar from "./global/Navbar";
import Sidebar from "./global/Sidebar";
// import { useRecoilValue } from "recoil";

// import { userDetailsAtom, isAuthenticatedAtom } from "../../recoil/atom";

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  //   const user = useRecoilValue(userDetailsAtom);
  //   const auth = useRecoilValue(isAuthenticatedAtom);
  //   useEffect(() => {
  //     if (auth === false || user === null) {
  //       window.location.pathname = "/";
  //       return;
  //     }
  //   }, [auth, user]);
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className=" p-2 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
