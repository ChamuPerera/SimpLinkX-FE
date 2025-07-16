import { AuthProvider } from "@/hooks/use-auth";
import {
  AboutPage,
  DashboardPage,
  FindHospitalsPage,
  ForgotPasswordPage,
  HomePage,
  HospitalsPage,
  InventoriesPage,
  LoginPage,
  NotFoundPage,
  PermissionsPage,
  RegisterPage,
  ResetPasswordPage,
  RolesPage,
  SelectedHospitalPage,
  StaffPage,
} from "@/pages";
import AccountPage from "@/pages/account";
import UpdatePersonalDetailsPage from "@/pages/personal-details";
import PrescriptionsPage from "@/pages/prescriptions";
import CalculateNCDRiskPage from "@/pages/calculate-ncd-risk";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/appointment" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/find-hospitals" element={<FindHospitalsPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/personal-details" element={<UpdatePersonalDetailsPage />} />
          <Route path="/find-hospitals/:identifier" element={<SelectedHospitalPage />}/>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/inventories" element={<InventoriesPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/calculate-ncd-risk" element={<CalculateNCDRiskPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
