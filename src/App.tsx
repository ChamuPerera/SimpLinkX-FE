import { AuthProvider } from "@/hooks/use-auth";
import {
  AboutPage,
  AccountPage,
  AppointmentsPage,
  CalculateNCDRiskPage,
  ClinicDatesPage,
  ClinicPatientsPage,
  ClinicsPage,
  DashboardPage,
  FindHospitalsPage,
  ForgotPasswordPage,
  HomePage,
  HospitalSettingsPage,
  HospitalsPage,
  InventoriesPage,
  LoginPage,
  MakeAppointmentsPage,
  MedicineSearchPage,
  NotFoundPage,
  OpdDatesPage,
  OsusalaPage,
  PatientsPage,
  PermissionsPage,
  PharmaciesPage,
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
          <Route path="/osusala" element={<OsusalaPage />} />
          <Route path="/ncd-risk" element={<CalculateNCDRiskPage />} />
          <Route
            path="/find-hospitals/:identifier"
            element={<SelectedHospitalPage />}
          />
          <Route
            path="/find-hospitals/:identifier/medicines"
            element={<MedicineSearchPage />}
          />
          <Route
            path="/find-hospitals/:identifier/token"
            element={<MakeAppointmentsPage />}
          />

          {/* protected routes */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/clinic-patients" element={<ClinicPatientsPage />} />
          <Route path="/clinics/dates" element={<ClinicDatesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/inventories" element={<InventoriesPage />} />
          <Route path="/opd-dates" element={<OpdDatesPage />} />
          <Route path="/permissions" element={<PermissionsPage />} />
          <Route path="/people" element={<StaffPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/pharmacies" element={<PharmaciesPage />} />
          <Route path="/prescriptions" element={<PrescriptionsPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/settings/hospital" element={<HospitalSettingsPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
