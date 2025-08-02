import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import Home from "./screens/Home";
import Login from "./screens/Login";
import AddReport from "./screens/AddReport";
import ViewReport from "./screens/ViewReport";
import AdminLogin from "./screens/AdminLogin";
import AdminDashboard from "./screens/AdminDashboard";
import { CardProvider } from "./store/useCardContext";

function App() {
  return (
    <CardProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="reports" element={<AdminDashboard />} />
                <Route path="users" element={<AdminDashboard />} />
                <Route path="analytics" element={<AdminDashboard />} />
              </Routes>
            </AdminLayout>
          } />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/report" element={<AddReport/>}/>
                <Route path="/my-reports" element={<ViewReport/>}/>
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </CardProvider>
  );
}

export default App;
