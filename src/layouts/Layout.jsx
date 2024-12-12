import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  useEffect(() => {
    Main();
  },[])
  return (
    <div className="layout-wrapper layout-content-navbar" style={{
      backgroundImage: `url("https://img.freepik.com/premium-photo/hydroponic-greenhouse-filled-rows-wallpaper_987764-47389.jpg")`, // Replace with your background image path
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <div className="layout-container" style={{
      backgroundSize: "cover",
      backgroundColor: "rgba(0, 0, 0, 0.3)", // Black filter with 50% opacity, corrected
      backgroundPosition: "center",
    }}>
        {/* <Sidebar /> */}
        <div className="layout-page ">
          {/* <Navbar /> */}
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
            {children}
            </div>
            <Footer />
          </div>
        </div>
      <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </div>
  );
};

export default Layout;
