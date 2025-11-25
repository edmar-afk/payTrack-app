/* eslint-disable no-unused-vars */
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Drawer, IconButton, Box, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import logo from "../assets/images/logo.png";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LogoutIcon from "@mui/icons-material/Logout";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

import WalkInModal from "./dashboard/WalkInModal";

function NavBar({ userInfo }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const paymentItems = [
    { name: "PTA", path: "/pta", icon: <SchoolIcon fontSize="small" /> },
    { name: "QAA", path: "/qaa", icon: <AssignmentIcon fontSize="small" /> },
    { name: "LAC", path: "/lac", icon: <PeopleIcon fontSize="small" /> },
    { name: "CF", path: "/cf", icon: <PaymentIcon fontSize="small" /> },
    {
      name: "RHC",
      path: "/rhc",
      icon: <AccountBalanceIcon fontSize="small" />,
    },
  ];

  const SidebarContent = (
    <nav className="bg-white shadow-md border-r border-gray-200 h-screen w-[250px] py-6 px-4 overflow-auto">
      <div className="flex flex-row items-center">
        <img src={logo} alt="logo" className="w-10 mr-2" />
        <p className="font-extrabold">PTA PayTrack</p>
      </div>

      {/* Dashboard Link */}
      <ul className="mt-6 space-y-1">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-slate-800 font-medium text-[15px] flex items-center rounded px-4 py-2 transition-all duration-300 ${
                isActive
                  ? "border-l-[5px] border-green-800 bg-green-100 ml-2"
                  : "hover:ml-2 hover:bg-gray-100"
              }`
            }
          >
            <span className="mr-3">
              <DashboardIcon fontSize="small" />
            </span>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <div className="cursor-pointer text-slate-800 font-medium text-[15px] flex items-center rounded px-4 py-2 transition-all duration-300 hover:ml-2 hover:bg-gray-100">
            <span className="mr-3">
              <DirectionsWalkIcon fontSize="small" />
            </span>
            <span>
              <WalkInModal />
            </span>
          </div>
        </li>
      </ul>

      {/* Payments Section */}
      {/* <p className="mt-12 mb-2 px-4 text-xs font-semibold text-gray-500 uppercase">
        Payments
      </p>
      <ul className="space-y-1">
        {paymentItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `text-slate-800 font-medium text-[15px] flex items-center rounded px-4 py-2 transition-all duration-300 ${
                  isActive
                    ? "border-l-[5px] border-green-800 bg-green-100 ml-2"
                    : "hover:ml-2 hover:bg-gray-100"
                }`
              }
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul> */}

      {/* Logout Link */}
      <ul className="mt-6 space-y-1">
        <li>
          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `text-slate-800 font-medium text-[15px] flex items-center rounded px-4 py-2 transition-all duration-300 ${
                isActive
                  ? "border-l-[5px] border-green-800 bg-green-100 ml-2"
                  : "hover:ml-2 hover:bg-gray-100"
              }`
            }
          >
            <span className="mr-3">
              <LogoutIcon fontSize="small" />
            </span>
            <span>Logout</span>
          </NavLink>
        </li>
      </ul>

      {/* Welcome Box */}
      <div
        id="dropdown-cta"
        className="p-4 mt-6 rounded-lg bg-green-100"
        role="alert"
      >
        <div className="flex items-center mb-3">
          <span className="bg-green-300 text-gray-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm">
            Welcome, {userInfo?.role || "Admin"}.
          </span>
        </div>
        <p className="mb-3 text-sm text-gray-800">
          Here you can manage{" "}
          <span className="text-xs">
            pending payments, received payments, and upcoming dues
          </span>
          . Stay updated and ensure smooth payment tracking for all students.
        </p>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      {!isDesktop && (
        <IconButton onClick={() => setOpen(true)} className="m-3">
          <MenuIcon className="text-white" />
        </IconButton>
      )}

      {/* Desktop Fixed Sidebar */}
      {isDesktop ? (
        <div className="fixed top-0 left-0">{SidebarContent}</div>
      ) : (
        <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
          <Drawer open={open} onClose={() => setOpen(false)} anchor="left">
            <Box>{SidebarContent}</Box>
          </Drawer>
        </Drawer>
      )}
    </>
  );
}

export default NavBar;
