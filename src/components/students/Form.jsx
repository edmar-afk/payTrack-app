/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../../assets/api";

function Form({ user, selected, semester }) {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [committee, setCommittee] = useState(null);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  const fetchProfile = () => {
    if (user?.id) {
      api
        .get(`/api/profiles/${user.id}/`)
        .then((res) => setProfile(res.data))
        .catch((err) => console.error(err));
    }
  };

  const fetchCommittee = () => {
    if (selected) {
      api
        .get(`/api/committee/latest/${selected}/`)
        .then((res) => setCommittee(res.data))
        .catch(() => setCommittee(null));
    }
  };

  const checkPayment = () => {
    if (user?.id && selected) {
      api
        .get(`/api/check-payment/${user.id}/${selected}/`)
        .then((res) => {
          if (res.data.submitted) {
            setAlreadySubmitted(true);
          } else {
            setAlreadySubmitted(false);
          }
        })
        .catch(() => setAlreadySubmitted(false));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  useEffect(() => {
    fetchCommittee();
    checkPayment();
  }, [selected, user]);

  const handleFile = (f) => {
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setError("");
    } else {
      setFile(null);
      setError("Only image files are allowed.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    handleFile(f);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const resetForm = () => {
    setFile(null);
    setError("");
    setSuccess("");
    fetchProfile();
    fetchCommittee();
    checkPayment();
  };

  const isDisabled =
    alreadySubmitted ||
    !profile?.year_lvl ||
    !profile?.course ||
    !file ||
    error !== "" ||
    loading;

  const handleSubmit = async () => {
    if (isDisabled) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("proof", file);
      formData.append("payment", selected);
      formData.append("semester", semester || "");

      await api.post(`/api/submit-payment/${user.id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Payment uploaded successfully. Waiting for approval.");
      setFile(null);
      checkPayment();
    } catch (err) {
      setError("Failed to upload payment. Refreshing form...");
      console.error(err);
      setTimeout(() => resetForm(), 1200);
    } finally {
      setLoading(false);
    }
  };

  // console.log(
  //   "Submitting payment for student:",
  //   user.id,
  //   "committee:",
  //   selected,
  //   "semester:",
  //   semester
  // );

  return (
    <form className="mt-12" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-4">
        <div>
          <input
            type="text"
            value={`${user.last_name || ""}, ${user.first_name || ""}`}
            readOnly
            className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md outline-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Year Level"
              value={profile?.year_lvl || ""}
              readOnly
              className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md outline-0"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Course"
              value={profile?.course || ""}
              readOnly
              className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md outline-0"
            />
          </div>
        </div>

        {committee && (
          <div>
            <input
              type="text"
              placeholder="Amount"
              value={committee.amount || ""}
              readOnly
              className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md outline-0"
            />
          </div>
        )}

        {/* File Upload */}
        <div
          className={`bg-gray-50 text-center px-4 rounded w-full flex flex-col items-center justify-center cursor-pointer border-2 ${
            dragActive ? "border-green-500 bg-green-50" : "border-gray-300"
          } border-dashed mx-auto`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="py-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 mb-4 fill-slate-600 inline-block"
              viewBox="0 0 32 32"
            >
              <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
              <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
            </svg>
            <h4 className="text-base font-semibold text-slate-600">
              Drag and drop files here
            </h4>
          </div>

          <hr className="w-full border-gray-300 my-2" />

          <div className="py-6">
            <input
              type="file"
              id="uploadFile1"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
              accept="image/*"
            />
            <label
              htmlFor="uploadFile1"
              className="block px-6 py-2.5 rounded text-slate-600 text-sm tracking-wider font-semibold border-none outline-none cursor-pointer bg-gray-200 hover:bg-gray-100"
            >
              Browse Files
            </label>
            <p className="text-xs text-slate-500 mt-4">
              PNG, JPG, SVG, WEBP, and GIF are allowed.
            </p>
            {error && (
              <p className="text-red-500 text-xs font-medium mt-2">{error}</p>
            )}
            {file && !error && (
              <p className="text-green-600 text-xs font-medium mt-2">
                {file.name} selected
              </p>
            )}
            {success && (
              <p className="text-green-700 text-xs font-medium mt-2">
                {success}
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSubmit}
        className={`mt-8 w-60 py-3 text-[15px] font-medium rounded-md tracking-wide cursor-pointer ${
          isDisabled
            ? "bg-red-500 text-white opacity-70 cursor-not-allowed"
            : "bg-purple-500 hover:bg-purple-600 text-white"
        }`}
      >
        {alreadySubmitted
          ? "You already submitted payment in this category"
          : loading
          ? "Processing..."
          : "Pay"}
      </button>
    </form>
  );
}

export default Form;
