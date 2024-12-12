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
  const [dataSwitch, setDataSwitch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSwitchChange = async (zone) => {
    const newState = dataSwitch[zone] === "on" ? "off" : "on";
    try {
      const response = await fetch(`${apiEndpoints.getObject}/device/vertical/switch`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zone: zone,
          state: newState,
        }),
      });
   
      if (!response.ok) {
        throw new Error(`Failed to update switch for ${zone}`);
      }
   
      setDataSwitch((prevState) => ({ ...prevState, [zone]: newState }));
    } catch (error) {
      console.error("Error updating switch state:", error); 
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiEndpoints.getObject}/location/gh2`);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();

        setDataSwitch(result.switch);
        setDataTable(result.devices);
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }; 

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
      <h4 className="py-3" style={{ color: "white" }}>
        <span className="text-muted fw-light">
          {" "}
          <Link to="/">Dashboard</Link> /
        </span>{" "}
        Puspita Farm 1
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
                    {/* Zone 1 Switch */}
                    <div
                      className="form-check form-switch flex-column align-items-right"
                      style={{ fontSize: "2rem" }}
                    >
                      <input
                        className="form-check-input mb-2"
                        type="checkbox"
                        id="flexSwitchCheckDefault1"
                        style={{ width: "4rem", height: "2rem" }}
                        checked={dataSwitch.zone1 === "on"}
                        onChange={() => handleSwitchChange("zone1")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault1"
                        style={{ fontSize: "2rem" }}
                      >
                        Zone 1
                      </label>
                    </div>

                    {/* Zone 2 Switch */}
                    <div
                      className="form-check form-switch flex-column align-items-center"
                      style={{ fontSize: "2rem" }}
                    >
                      <input
                        className="form-check-input mb-2"
                        type="checkbox"
                        id="flexSwitchCheckDefault2"
                        style={{ width: "4rem", height: "2rem" }}
                        checked={dataSwitch.zone2 === "on"}
                        onChange={() => handleSwitchChange("zone2")}
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
                        checked={dataSwitch.zone3 === "on"}
                        onChange={() => handleSwitchChange("zone3")}
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
                    style={{ paddingTop: "15px", height: "300px" }} 
                  >
                    {" "}
                    {/* Center content horizontally */}
                    <h5>
                      <b>Temperature</b>
                    </h5>{" "}
                    {/* Center the text */}
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "100%",
                        textAlign: "center",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }} 
                    >
                      {data ? (
                        <h1
                          style={{
                            fontSize: "80px",
                            wordBreak: "break-word",
                            overflowWrap: "break-word",
                            textAlign: "center",
                          }}
                        >
                          {data.sensor?.suhu}°C
                        </h1>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3 col-md-3">
                <div className="card">
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ paddingTop: "15px", height: "300px" }} 
                  >
                    {" "}
                    {/* Center content horizontally */}
                    <h5>
                      <b>Humidity</b>
                    </h5>{" "}
                    {/* Center the text */}
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: "100%",
                        textAlign: "center",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }} 
                    >
                      {data ? (
                        <h1
                          style={{
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
