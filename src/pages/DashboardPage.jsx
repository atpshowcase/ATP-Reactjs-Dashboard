import { useEffect } from "react";
import { Link } from "react-router-dom";

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
                <h5 className="m-0">Vertical Farming</h5>
              </div>
            </div>

            <div className="card-body">
              <div className="text-center mt-3">
                <Link to="/vertical-farming">
                  <img
                    src="https://i.pinimg.com/736x/39/e4/26/39e426741c29f67274c8d23734f19aea.jpg"
                    alt="Vertical Farming"
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
                <h5 className="m-0">Drip Irrigation</h5>
              </div>
            </div>

            <div className="card-body">
              <div className="text-center mt-3">
                <Link to="/drip-irrigation">
                  <img
                    src="https://png.pngtree.com/png-clipart/20230923/original/pngtree-drip-irrigation-system-vector-icon-drop-ground-irrigation-vector-png-image_12575240.png"
                    alt="Vertical Farming"
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
