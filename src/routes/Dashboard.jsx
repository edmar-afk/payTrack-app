import PaymentTable from "../components/dashboard/PaymentTable";
import Stats from "../components/dashboard/Stats";
import NavBar from "../components/NavBar";

function Dashboard({ user }) {
  return (
    <>
      <div className="w-full">
        <div className="bg-green-600 lg:bg-transparent p-4 flex flex-row items-center justify-between fixed w-full">
          <NavBar userInfo={user} />
          <p className="text-lg font-bold text-white block lg:hidden">JHCSC PayTrack</p>
        </div>
        <div className="ml-0 lg:ml-64 p-8 pt-24">
          <Stats />
          <PaymentTable />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
