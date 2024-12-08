import { Route, Routes } from "react-router-dom";
// Layout
import { TablesPage } from "../pages/TablesPage";
import { VerticalFarmingPage } from "../pages/VerticalFarmingPage";
import { DripIrrigationPage } from "../pages/DripIrrigationPage";
import { DashboardFormPage } from "../pages/DashboardFormPage";
import { DashboardFormActionPage } from "../pages/DashboardFormActionPage";
import { DashboardFormFlowRatePage } from "../pages/DashboardFormFlowRatePage";
import { DashboardPage } from "../pages/DashboardPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            
            <Route path="/tables" element={<TablesPage />} />

            <Route path="/vertical-farming" element={<VerticalFarmingPage />} />    
            <Route path="/drip-irrigation" element={<DripIrrigationPage />} />    

            <Route path="/dashboard-action/:id" element={<DashboardFormPage />} />
            <Route path="/dashboard-action/add" element={<DashboardFormActionPage />} />
            <Route path="/dashboard-action/edit/:id" element={<DashboardFormActionPage />} />
            <Route path="/dashboard-action/flowrate/:id" element={<DashboardFormFlowRatePage />} />

            <Route path="/devices" element={<TablesPage />} />            
            <Route path="/managements" element={<TablesPage />} />
        </Routes>
    )
}
export default AppRoutes;