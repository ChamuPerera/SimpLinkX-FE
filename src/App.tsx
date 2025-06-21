import { AuthProvider } from "@/hooks/use-auth";
import {
  AboutPage,
  DashboardPage,
  FindHospitalsPage,
  HomePage,
  HospitalsPage,
  LoginPage,
  NotFoundPage,
  RegisterPage,
  SelectedHospitalPage,
  StaffPage
} from "@/pages";
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
          <Route path="/find-hospitals" element={<FindHospitalsPage />} />
          <Route
            path="/find-hospitals/:identifier"
            element={<SelectedHospitalPage />}
          />

          {/* protected routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/staff" element={<StaffPage />} />

          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
