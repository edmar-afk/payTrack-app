import Stats from "../components/dashboard/Stats";
import Table from "../components/dashboard/Table";
import NavBar from "../components/NavBar";

function Dashboard({ user }) {
  return (
    <>
      <div className="w-full">
        <NavBar userInfo={user} />
        <div className="ml-64 p-8">
          <Stats />
          <Table type='Dashboard'/>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
