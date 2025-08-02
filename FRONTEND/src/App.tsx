import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./screens/Home";
import Login from "./screens/Login";
import AddReport from "./screens/AddReport";
import ViewReport from "./screens/ViewReport";
import { CardProvider } from "./store/useCardContext";

function App() {
  return (
    <CardProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/report" element={<AddReport/>}/>
            <Route path="/my-reports" element={<ViewReport/>}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </CardProvider>
  );
}

export default App;
