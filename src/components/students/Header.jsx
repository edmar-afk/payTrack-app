import logo from "../../assets/images/logo.png";
import { getUserInfoFromToken } from "../../utils/auth";
import InfoIcon from "@mui/icons-material/Info";
import Navbar from "./Navbar";
function Header() {
  const token = localStorage.getItem("access");
  const userInfo = getUserInfoFromToken(token);

  return (
    <>
      <div className="p-4 bg-gray-950 flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <img
            src={logo}
            className="w-10 h-10 bg-white rounded-full p-1.5"
            alt=""
          />
          <p className="text-white ml-2">JHCSC PayTrack</p>
        </div>
        <div className="text-white">
          Welcome, {userInfo?.first_name || "Guest"}
        </div>
      </div>
      <Navbar/>
      <div className="bg-gray-900 w-full p-4 lg:p-12 pb-24">
        <p className="text-white flex items-center mb-0 lg:mb-12 text-xs lg:text-xl">
          <InfoIcon fontSize="large" className="mr-3 animate-pulse" />
          Please make your payments carefully. Double-check the details to avoid
          sending money to the wrong category.
        </p>
      </div>
    </>
  );
}

export default Header;
