import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ClipLoader } from "react-spinners";
import { Link, useNavigate, useLocation } from "react-router-dom";
import apiEndpoints from "../config/apiConfig";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const VerticalFarmingPage = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiEndpoints.getObject}/location/gh1`);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();

        setDataTable(result.devices);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleEdit = (rowId) => {
    const stateKelembapan = data.sensor?.kelembapan;
    navigate(`/dashboard-action/${rowId}`, { state: { stateKelembapan } });
  };

  const paginatedData = dataTable.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      name: "No.",
      selector: (row, index) => (currentPage - 1) * rowsPerPage + index + 1,
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
            onClick={() => handleEdit(row.deviceId)}
          >
            <i className="fas fa-pencil-alt"></i>
          </button>
        </div>
      ),
      width: "100px",
    },
    {
      name: "Device Name",
      selector: (row) => row.deviceId,
      sortable: true,
    },
    {
      name: "Temperature",
      selector: (row) => row.lastSensorValue?.suhu || "N/A",
      sortable: true,
    },
    {
      name: "TDS",
      selector: (row) => row.lastSensorValue?.tds || "N/A",
      wrap: true,
      sortable: true,
    },
    {
      name: "PH",
      selector: (row) => row.lastSensorValue?.ph || "N/A",
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
        Vertical Farming
      </h4>

      <div className="card mb-4">
        <h5 className="card-header">Switch Controls</h5>

        <hr className="my-0" />
        <div className="card-body">
          <form
            id="formAccountSettings"
            method="POST"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="row">
              <div className="mb-3 col-md-6">
                <div className="d-flex justify-content-center ">
                  <div className="d-flex flex-column gap-4 align-items-right">
                    <div
                      className="form-check form-switch flex-column align-items-right"
                      style={{ fontSize: "2rem" }}
                    >
                      <input
                        className="form-check-input mb-2"
                        type="checkbox"
                        id="flexSwitchCheckDefault1"
                        style={{ width: "4rem", height: "2rem" }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault1"
                        style={{ fontSize: "2rem" }}
                      >
                        Zone 1
                      </label>
                    </div>

                    <div
                      className="form-check form-switch flex-column align-items-center"
                      style={{ fontSize: "2rem" }}
                    >
                      <input
                        className="form-check-input mb-2"
                        type="checkbox"
                        id="flexSwitchCheckDefault2"
                        style={{ width: "4rem", height: "2rem" }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault2"
                        style={{ fontSize: "2rem" }}
                      >
                        Zone 2
                      </label>
                    </div>

                    <div
                      className="form-check form-switch flex-column align-items-center"
                      style={{ fontSize: "2rem" }}
                    >
                      <input
                        className="form-check-input mb-2"
                        type="checkbox"
                        id="flexSwitchCheckDefault3"
                        style={{ width: "4rem", height: "2rem" }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault3"
                        style={{ fontSize: "2rem" }}
                      >
                        Zone 3
                      </label>
                    </div>
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
                    <Link to="/vertical-farming" className="text-center">
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
                              paddingTop: "50px",
                              fontSize: "80px",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              textAlign: "center",
                            }}
                          >
                            {data.sensor?.suhu}°
                          </h1>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </div>
                    </Link>
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
                    <Link to="/vertical-farming" className="text-center">
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
                        {data ? (
                          <h1
                            style={{
                              paddingTop: "50px",
                              fontSize: "80px",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              textAlign: "center",
                            }}
                          >
                            {data.sensor?.kelembapan}%
                          </h1>
                        ) : (
                          <p>Loading...</p>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <h5 className="card-header">List of Devices</h5>

        <hr className="my-0" />
        <div className="card-body">
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
                paginationTotalRows={data.length}
                paginationPerPage={rowsPerPage}
                paginationServer
                onChangePage={(page) => setCurrentPage(page)}
                onChangeRowsPerPage={(newPerPage, page) => {
                  setRowsPerPage(newPerPage);
                  setCurrentPage(page);
                }}
                highlightOnHover
                responsive
                striped
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
