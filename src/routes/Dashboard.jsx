import PaymentTable from "../components/dashboard/PaymentTable";
import Stats from "../components/dashboard/Stats";
import NavBar from "../components/NavBar";

function Dashboard({ user }) {
  return (
    <>
      <div className="w-full">
        <NavBar userInfo={user} />
        <div className="ml-64 p-8">
          <Stats />
          <PaymentTable/>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
