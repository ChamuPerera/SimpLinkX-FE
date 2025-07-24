import { AuthProvider } from "@/hooks/use-auth";
import {
  AboutPage,
  AccountPage,
  CalculateNCDRiskPage,
  DashboardPage,
  FindHospitalsPage,
  ForgotPasswordPage,
  HomePage,
  HospitalsPage,
  InventoriesPage,
  LoginPage,
  MakeAppointmentsPage,
  MedicineSearchPage,
  NotFoundPage,
  PermissionsPage,
  PrescriptionsPage,
  RegisterPage,
  ResetPasswordPage,
  RolesPage,
  SelectedHospitalPage,
  StaffPage,
} from "@/pages";
import { BrowserRouter, Route, Routes } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/find-hospitals" element={<FindHospitalsPage />} />
          <Route path="/ncd-risk" element={<CalculateNCDRiskPage />} />
          <Route
            path="/find-hospitals/:identifier"
            element={<SelectedHospitalPage />}
          />
          <Route
            path="/find-hospitals/:identifier/medicines"
            element={<MedicineSearchPage />}
          />

          {/* protected routes */}
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/appointments" element={<MakeAppointmentsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/people" element={<StaffPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/inventories" element={<InventoriesPage />} />
          <Route path="/account" element={<AccountPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
