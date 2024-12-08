import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import apiEndpoints from "../config/apiConfig";
import { formatTime } from "../helpers/dateHelpers";
import Swal from "sweetalert2"; // Import SweetAlert

import "@fortawesome/fontawesome-free/css/all.min.css";

export const DashboardFormPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const location = useLocation();
  const stateKelembapan = location.state?.stateKelembapan || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiEndpoints.getObject}/device/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();

        setDataTable(result.dossingPump.schedule);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Hentikan loading
      }
    };

    fetchData();
  }, []);

  const handleEdit = (row) => {
    navigate(`/dashboard-action/edit/${row._id}`, {
      state: { stateScheduleData: row, stateDeviceID: id },
    });
  };
  const handleBack = () => {
    navigate(-1);
  };

  const paginatedData = dataTable.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAddNew = () => {
    navigate(`/dashboard-action/add`, {
      state: { stateDeviceID: id },
    });
  };

  const handleFlorate = () => {
    navigate(`/dashboard-action/flowrate/${id}`);
  };

  
const handleDelete = async (scheduleId) => {
  console.log(scheduleId)
  // Show confirmation dialog
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true, // Swap the button positions
  });

  if (result.isConfirmed) {
    try {
      setLoading(true); // Show a loading spinner or state

      const response = await fetch(
        `${apiEndpoints.getObject}/device/${id}/schedule/${scheduleId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete schedule");
      }

      // Update the data table after successful deletion
      setDataTable((prevData) =>
        prevData.filter((schedule) => schedule._id !== scheduleId)
      );

      // Show success notification
      Swal.fire("Deleted!", "The schedule has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting schedule:", error);

      // Show error notification
      Swal.fire(
        "Error!",
        "Failed to delete the schedule. Please try again.",
        "error"
      );
    } finally {
      setLoading(false); // Hide the loading spinner or state
    }
  }
};

  
  const columns = [
    {
      name: "No.",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1, // Hitung nomor berlanjut
      sortable: false,
      width: "80px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex gap-2">
          {/* Edit button */}
          <button
            className="btn btn-sm btn-primary"
            title="Edit"
            onClick={() => handleEdit(row)}
          >
            <i className="fas fa-pencil-alt"></i>
          </button>

          <button
            className="btn btn-sm btn-danger"
            title="Delete"
            onClick={() => handleDelete(row._id)}
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      ),
      width: "150px",
    },
    {
      name: "Time",
      selector: (row) => formatTime(row.time),
      sortable: true,
    },
    {
      name: "Dosis",
      selector: (row) => row.dosis || "N/A", // Konversi boolean ke teks
      wrap: true,
      sortable: true,
    },
    {
      name: "Repeat",
      selector: (row) => row.repeat || "N/A", // Konversi boolean ke teks
      wrap: true,
      sortable: true,
    },
  ];

  return (
    <div className="container">
      <h4 className="py-3">
        <span className="text-muted fw-light">
          {" "}
          <Link to="/">Dashboard</Link> /
        </span>{" "}
        Form
      </h4>

      <div className="card mb-4">
        <div className="row">
          <div className="col-md-6">
            <h5 className="card-header">Information {id}</h5>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <div className="card-header">
              <button className="btn btn-warning" onClick={handleFlorate}>
                Flow Rate
              </button>
            </div>
          </div>
        </div>

        <hr className="my-0" />
        <div className="card-body">
          <form
            id="formAccountSettings"
            method="POST"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="row">
              <div className="mb-3 col-md-3">
                <div className="card">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ paddingTop: "15px", height: "300px" }} // Add desired height
                  >
                    {" "}
                    {/* Center content horizontally */}
                    <h5><b>PH</b></h5> {/* Center the text */}
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "100%",
                        textAlign: "center",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }} // Ensure text wraps
                    >
                      {data ? (
                        <h1
                          style={{
                            paddingTop: "5px",
                            fontSize: "80px",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "center",
                          }}
                        >
                          {data.lastSensorValue?.ph}
                        </h1>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <Link to="/vertical-farming" className="text-center"></Link>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-md-3">
                <div className="card">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ paddingTop: "15px", height: "300px" }} // Add desired height
                  >
                    {" "}
                    {/* Center content horizontally */}
                    <h5><b>TDS</b></h5> {/* Center the text */}
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "100%",
                        textAlign: "center",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }} // Ensure text wraps
                    >
                      {data ? (
                        <h1
                          style={{
                            paddingTop: "1px",
                            fontSize: "50px",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "center",
                          }}
                        >
                          {data.lastSensorValue?.tds} ppm
                        </h1>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <Link to="/vertical-farming" className="text-center"></Link>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-md-3">
                <div className="card">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ paddingTop: "15px", height: "300px" }} // Add desired height
                  >
                    {" "}
                    {/* Center content horizontally */}
                    <h5><b>Temperature</b></h5> {/* Center the text */}
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "100%",
                        textAlign: "center",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }} // Ensure text wraps
                    >
                      {data ? (
                        <h1
                          style={{
                            paddingTop: "5px",
                            fontSize: "80px",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "center",
                          }}
                        >
                          {data.lastSensorValue?.suhu}°
                        </h1>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <Link to="/vertical-farming" className="text-center"></Link>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-md-3">
                <div className="card">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ paddingTop: "15px", height: "300px" }} // Add desired height
                  >
                    {" "}
                    {/* Center content horizontally */}
                    <h5><b>Humidity</b></h5> {/* Center the text */}
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "100%",
                        textAlign: "center",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }} // Ensure text wraps
                    >
                      {stateKelembapan ? (
                        <h1
                          style={{
                            paddingTop: "5px",
                            fontSize: "80px",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "center",
                          }}
                        >
                          {stateKelembapan}%
                        </h1>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <Link to="/vertical-farming" className="text-center"></Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="row">
          <div className="col-md-6">
            <h5 className="card-header">List of Schedules</h5>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <h5 className="card-header">
              <button className="btn btn-success" onClick={handleAddNew}>
                <i className="fas fa-plus" style={{ marginRight: "8px" }}></i>
                Add New
              </button>
            </h5>
          </div>
        </div>

        <div className="card-body">
          <hr className="my-0" />
          <div className="d-flex justify-content-end mt-3"></div>
          <div className="table-responsive">
            {loading ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "200px" }}
              >
                <ClipLoader color="#3498db" loading={loading} size={50} />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={paginatedData}
                pagination
                paginationTotalRows={dataTable.length}
                paginationPerPage={rowsPerPage}
                paginationServer
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                  setRowsPerPage(newPerPage); // Update jumlah baris per halaman
                  setCurrentPage(page); // Reset halaman saat ini
                }}
                highlightOnHover
                responsive
                striped
              />
            )}
          </div>

          <div className="d-flex justify-content-center mt-3 pb-2">
            <button className="btn btn-secondary" onClick={handleBack}>
              <i className="fas fa-arrow-left me-2"></i> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
