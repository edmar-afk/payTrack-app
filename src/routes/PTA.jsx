import Stats from "../components/dashboard/Stats";
import Table from "../components/dashboard/Table";
import NavBar from "../components/NavBar";

function PTA({ user }) {
  return (
    <>
      <div className="w-full">
        <NavBar userInfo={user} />
        <div className="ml-64 p-8">
          <Table type="PTA" />
        </div>
      </div>
    </>
  );
}

export default PTA;
