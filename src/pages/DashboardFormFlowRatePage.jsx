import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2"; // Import SweetAlert2
import apiEndpoints from "../config/apiConfig";
import LoadingOverlay from "react-loading-overlay-ts"; // Import the TypeScript version of LoadingOverlay

export const DashboardFormFlowRatePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const setScheduleData = location.state?.stateScheduleData || {};
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    time: "",
    ml: "",
    option: "",
    condition: "try",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (id && Object.keys(setScheduleData).length > 0) {
      setData(setScheduleData);
      setValue("time", setScheduleData.time || "");
      setValue("ml", setScheduleData.ml || "");
      setValue("option", setScheduleData.option || "");
    }
    setLoading(false);
  }, [id, setScheduleData, setValue]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async (formData, condition) => {
    setIsSaving(true); // Block UI

    const payload = {
      time: formData.time,
      ml: formData.ml,
      option: formData.option,
      condition: condition,
    };

    const isEdit = !!id;
    const url = `${apiEndpoints.getObject}/device/flowrate/${id}`;

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
              ? "Flow Rate updated successfully!"
              : "Flow Rate created successfully!",
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
      )

    }
  };

  // Event handlers for Save and Try buttons
  const handleSaveClick = (formData) => handleSave(formData, "save");
  const handleTryClick = (formData) => handleSave(formData, "try");

  return (
    <LoadingOverlay active={isSaving} spinner text="Saving...">
      <div className="container">
        <h4 className="py-3">
          <span className="text-muted fw-light">
            <Link to="/">Dashboard</Link> /
          </span>{" "}
          Flow Rate
        </h4>

        <div className="card mb-4">
          <h5 className="card-header">Form of Flow Rate</h5>
          <div className="card-body">
            <form
              onSubmit={handleSubmit((formData) => handleSaveClick(formData))}
            >
              {/* Option Selection */}
              <div className="mb-3">
                <label htmlFor="optionType" className="form-label">
                  Type
                </label>
                <div className="col-md">
                  <div className="form-check form-check-inline mt-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="optionA"
                      value="A"
                      {...register("option", {
                        required: "Option is required",
                      })}
                    />
                    <label className="form-check-label" htmlFor="optionA">
                      A
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="optionB"
                      value="B"
                      {...register("option", {
                        required: "Option is required",
                      })}
                    />
                    <label className="form-check-label" htmlFor="optionB">
                      B
                    </label>
                  </div>
                </div>
                {errors.option && (
                  <p className="text-danger">{errors.option.message}</p>
                )}
              </div>

              {/* ML (Dosis) Input */}
              <div className="mb-3">
                <label htmlFor="mlInput" className="form-label">
                  ML
                </label>
                <input
                  className={`form-control ${errors.ml ? "border-danger" : ""}`}
                  id="mlInput"
                  type="number"
                  step="1"
                  min="0"
                  {...register("ml", { required: "ML is required" })}
                  value={data.ml || ""}
                  onChange={(e) => {
                    setData({ ...data, ml: e.target.value });
                    setValue("ml", e.target.value);
                  }}
                />
                {errors.ml && (
                  <p className="text-danger">{errors.ml.message}</p>
                )}
              </div>

              {/* Time Input */}
              <div className="mb-3">
                <label htmlFor="timeInput" className="form-label">
                  Time (Millisecond)
                </label>
                <input
                  className={`form-control ${
                    errors.time ? "border-danger" : ""
                  }`}
                  id="timeInput"
                  type="number"
                  step="1"
                  min="0"
                  {...register("time", { required: "Time is required" })}
                  value={data.time || ""}
                  onChange={(e) => {
                    setData({ ...data, time: e.target.value });
                    setValue("time", e.target.value);
                  }}
                />
                {errors.time && (
                  <p className="text-danger">{errors.time.message}</p>
                )}
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
                  onClick={handleSubmit((formData) =>
                    handleSaveClick(formData)
                  )} // Save condition
                  title="Save"
                >
                  <i className="fas fa-save me-2"></i> Save
                </button>
                <button
                  className="btn btn-success ms-3"
                  type="button"
                  onClick={handleSubmit((formData) => handleTryClick(formData))} // Try condition
                  title="Try"
                >
                  <i className="fas fa-play me-2"></i> Try
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>{" "}
    </LoadingOverlay>
  );
};
