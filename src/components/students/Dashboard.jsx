import { useState } from "react";
import { getUserInfoFromToken } from "../../utils/auth";
import Info from "./Info";
import Form from "./Form";

function Dashboard() {
  const token = localStorage.getItem("access");
  const userInfo = getUserInfoFromToken(token);
  const [selected, setSelected] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const payment = ["Partial", "Full Pay"];
  const semester = ["First Semester", "Second Semester"];

  return (
    <>
      <div className="bg-white p-4 -mt-14 w-[95%] mx-auto rounded-t-xl shadow-2xl">
        <div className="px-24 mx-auto py-14">
          <div className="flex flex-wrap justify-between">
            <div className="lg:col-span-2 max-md:order-1">
              <h2 className="text-3xl font-semibold text-slate-900">
                Hello, {userInfo.first_name}
              </h2>
              <p className="text-slate-500 text-sm mt-4">
                Complete your transaction swiftly and securely with our
                easy-to-use payment process.
              </p>

              <div className="mt-8 max-w-lg">
                <h3 className="text-lg font-semibold text-slate-900">
                  Choose the methods to pay
                </h3>

                {/* Payment radio buttons */}
                <div className="flex flex-wrap gap-4 justify-start mt-6">
                  {payment.map((item) => (
                    <label
                      key={item}
                      className={`flex items-center text-center rounded-sm w-[100px] cursor-pointer border 
                        ${
                          selected === item
                            ? "bg-green-700 border-green-700 text-white"
                            : "border-gray-600 text-gray-900 hover:bg-green-300 hover:border-green-700"
                        }`}
                    >
                      <input
                        type="radio"
                        value={item}
                        checked={selected === item}
                        onChange={() => setSelected(item)}
                        name="payment"
                        className="hidden"
                      />
                      <span className="w-full py-4 text-sm font-medium">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Semester radio buttons - same design */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Choose Semester
                  </h3>
                  <div className="flex flex-wrap gap-4 justify-start mt-6">
                    {semester.map((sem) => (
                      <label
                        key={sem}
                        className={`flex items-center text-center rounded-sm w-[150px] cursor-pointer border 
                          ${
                            selectedSemester === sem
                              ? "bg-green-700 border-green-700 text-white"
                              : "border-gray-600 text-gray-900 hover:bg-green-300 hover:border-green-700"
                          }`}
                      >
                        <input
                          type="radio"
                          value={sem}
                          checked={selectedSemester === sem}
                          onChange={() => setSelectedSemester(sem)}
                          name="semester"
                          className="hidden"
                        />
                        <span className="w-full py-4 text-sm font-medium">
                          {sem}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <Form
                  user={userInfo}
                  selected={selected}
                  semester={selectedSemester}
                />
              </div>
            </div>

            <Info user={userInfo} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
