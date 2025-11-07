import React from "react";

function CommitteesInfo({ distribution }) {
  const committeeLimits = {
    PTA: 150,
    QAA: 100,
    LAC: 100,
    CF: 100,
    RHC: 100,
  };

  return (
    <>
      <p className="mt-5 text-xs text-gray-500">
        Amount will be distributed based on committee max limits.
      </p>

      <div className="mt-4 flex flex-row gap-4 flex-wrap">
        {Object.keys(committeeLimits).map((name) => (
          <div
            key={name}
            className="w-fit p-5 bg-white border border-gray-200 rounded-lg shadow-lg text-gray-500 font-bold"
          >
            {name}
            <div>
              <h5 className="mb-1 text-xl font-semibold tracking-tight text-gray-900">
                ₱{" "}
                {distribution?.[name] ? distribution[name].toFixed(2) : "0.00"}
              </h5>
              <p className="text-xs text-gray-400">
                Paid when reached <span className="text-blue-600">₱{committeeLimits[name]}.00</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CommitteesInfo;
