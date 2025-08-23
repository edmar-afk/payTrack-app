import ComitteeTable from "../components/dashboard/ComitteeTable";
import NavBar from "../components/NavBar";

function Comittee({ user }) {
  return (
    <>
      <div className="w-full">
        <NavBar userInfo={user} />
        <div className="ml-64 p-8">
          <ComitteeTable/>
        </div>
      </div>
    </>
  );
}

export default Comittee;
