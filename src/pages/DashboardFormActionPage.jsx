import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { formatTime, convertToIsoString } from "../helpers/dateHelpers";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2"; // Import SweetAlert2
import LoadingOverlay from "react-loading-overlay-ts"; // Import the TypeScript version of LoadingOverlay
import apiEndpoints from "../config/apiConfig";

export const DashboardFormActionPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const setScheduleData = location.state?.stateScheduleData || {};
  const setDeviceID = location.state?.stateDeviceID || {};

  console.log(setDeviceID)

  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [data, setData] = useState({ dosis: "", time: "", repeat: "" });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showAlertModal, setShowAlertModal] = useState(false); // State for alert modal

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (id && Object.keys(setScheduleData).length > 0) {
      setData(setScheduleData);
      setValue("_id", setScheduleData._id || "");
      setValue("dosis", setScheduleData.dosis || "");
      setValue("time", formatTime(setScheduleData.time) || "");
      setValue("repeat", setScheduleData.repeat || "");
    }
    setLoading(false);
  }, [id, setScheduleData, setValue]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmSave = (data) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to save this schedule?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
      reverseButtons: true, // Swap the button positions
    }).then((result) => {
      if (result.isConfirmed) {
        handleSave(data);
      }
    });
  };

  const handleSave = async (data) => {
    setIsSaving(true); // Block UI
    let strRepeat = data.repeat;
    if (strRepeat.startsWith(",")) strRepeat = strRepeat.substring(1);

    const payload = {
      dosis: data.dosis,
      time: convertToIsoString(data.time),
      repeat: strRepeat,
    };

    const isEdit = !!id;
    
    const url = isEdit
      ? `${apiEndpoints.getObject}/device/${setDeviceID}/schedule/${id}`
      : `${apiEndpoints.getObject}/device/${setDeviceID}/schedule`;

    try {
      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      
      setTimeout(() => {
        if (!response.ok) {
          Swal.fire(
            "Error",
            `Error: ${response.status} - ${response.statusText}`,
            "error"
          ).then(() => {
            setIsSaving(false); // Unblock UI
          });;
        } else {
          Swal.fire(
            "Saved!",
            isEdit
              ? "Schedule updated successfully!"
              : "Schedule created successfully!",
            "success"
          ).then(() => {
            setIsSaving(false); // Unblock UI
            navigate(-1);
          });
        }
      }, 1500);
    } catch (error) {
      Swal.fire(
        "Error",
        "An error occurred while saving the schedule. Please try again.",
        "error"
      );
    }
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    if (newTime !== data.time) {
      setData({ ...data, time: convertToIsoString(newTime) });
    }
  };

  return (
    <LoadingOverlay active={isSaving} spinner text="Saving...">
      <div className="container">
        <input type="hidden" name="_id" value={id || ""} {...register("_id")} />

        <h4 className="py-3">
          <span className="text-muted fw-light">
            <Link to="/">Dashboard</Link> /
          </span>{" "}
          {id ? "Edit" : "Add"} Form
        </h4>

        <div className="card mb-4">
          <h5 className="card-header">Form of Schedule</h5>
          <div className="card-body">
            <form
              id="formAccountSettings"
              method="POST"
              onSubmit={handleSubmit(handleConfirmSave)}
            >
              {/* Form Fields */}
              <div className="mb-3">
                <label htmlFor="exampleDataList" className="form-label">
                  Dosis
                </label>
                <input
                  className={`form-control ${
                    errors.dosis ? "border-danger" : ""
                  }`}
                  type="number"
                  id="exampleDataList"
                  step="1"
                  min="0"
                  {...register("dosis", { required: "Dosis is required" })}
                  value={data.dosis || ""}
                  onChange={(e) => {
                    setData({ ...data, dosis: e.target.value }); // Update data state on change
                    setValue("dosis", e.target.value); // Update react-hook-form value
                  }}
                />
                {errors.dosis && (
                  <p className="text-danger">{errors.dosis.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="html5-time-input" className="form-label">
                  Time
                </label>
                <input
                  className={`form-control ${
                    errors.time ? "border-danger" : ""
                  }`}
                  type="time"
                  id="html5-time-input"
                  {...register("time", { required: "Time is required" })}
                  value={data.time ? formatTime(data.time) : ""}
                  onChange={handleTimeChange}
                />
                {errors.time && (
                  <p className="text-danger">{errors.time.message}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Repeat</label>
                {[...Array(7)].map((_, i) => {
                  const dayValue = (i + 1).toString(); // Get the day number (1 for Monday, 2 for Tuesday, etc.)
                  return (
                    <div className="form-check" key={i}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`repeatCheck${i + 1}`}
                        checked={
                          data?.repeat?.split(",").includes(dayValue) || false
                        } // Check if the day is in repeat
                        onChange={(e) => {
                          let updatedRepeat = data?.repeat?.split(",") || []; // Split the current repeat value into an array

                          if (e.target.checked) {
                            // If the checkbox is checked, add the day to the repeat array
                            updatedRepeat = [
                              ...new Set([...updatedRepeat, dayValue]),
                            ]; // Avoid duplicates
                          } else {
                            // If the checkbox is unchecked, remove the day from the repeat array
                            updatedRepeat = updatedRepeat.filter(
                              (day) => day !== dayValue
                            );
                          }

                          // Convert the array back to a comma-separated string
                          const repeatString = updatedRepeat.join(",");

                          // Only set state if the repeatString has valid values
                          setData({ ...data, repeat: repeatString });
                          setValue("repeat", repeatString); // Update react-hook-form value
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`repeatCheck${i + 1}`}
                      >
                        {
                          [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ][i]
                        }
                      </label>
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-center mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={handleBack}
                  type="button"
                  title="Back"
                >
                  <i className="fas fa-arrow-left me-2"></i> Back
                </button>
                <button
                  className="btn btn-primary ms-3"
                  type="submit"
                  title="Save"
                >
                  <i className="fas fa-save me-2"></i> Save
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Confirmation */}
        {showModal && (
          <div
            className="modal show"
            tabIndex="-1"
            style={{ display: "block" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Save</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to save this schedule?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        {showAlertModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Alert</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAlertModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>asdsaddassad</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowAlertModal(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingOverlay>
  );
};
