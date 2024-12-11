import { useEffect } from "react";
import { Link } from "react-router-dom";
import verticalFarmingImage from "../assets/vertical-farming.jpg"; // Adjust the relative path based on your file structure
import dripIrrigationImage from "../assets/drip-irrigation.png"; // Adjust the relative path based on your file structure


export const DashboardPage = () => {
  useEffect(() => {
    dashboardAnalitics();
  }, []);
  return (
    <>
      <div className="row">
        <div className="col-md-6 col-lg-6 col-xl-6 order-0 mb-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-center pb-0">
              <div className="card-title mb-0 text-center">
                <h5 className="m-0">Puspita Farm 1</h5>
              </div>
            </div>

            <div className="card-body">
              <div className="text-center mt-3">
                <Link to="/vertical-farming">
                  <img
                    src={verticalFarmingImage}
                    alt="Puspita Farm 1"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-6 col-xl-6 order-0 mb-6">
          <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-center pb-0">
              <div className="card-title mb-0 text-center">
                <h5 className="m-0">Puspita Farm 2</h5>
              </div>
            </div>

            <div className="card-body">
              <div className="text-center mt-3">
                <Link to="/drip-irrigation">
                  <img
                    src={dripIrrigationImage}
                    alt="Puspita Farm 2"
                    className="img-fluid rounded"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
