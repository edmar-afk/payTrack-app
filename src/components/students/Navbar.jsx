import { Link } from "react-router-dom";
import RestoreIcon from "@mui/icons-material/Restore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
function Navbar() {
  return (
    <>
      <div className="flex flex-row bg-gray-900 text-gray-300 p-4 gap-5 px-12 text-sm">
        <Link to={"/"} className="flex items-center">
          <ExitToAppIcon fontSize="small" className="mr-1" />
          Logout
        </Link>
      </div>
    </>
  );
}

export default Navbar;
