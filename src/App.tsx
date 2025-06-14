import "./App.css";
import CalenderList from "./pages/Calender";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import LayoutWithHeader from "./components/LayoutWithHeader";
import RequireAuth from "./components/RequireAuth";
import { UserProvider } from "./context/UserContext";
import ExamplePage from "./pages/ExamplePage";

function App() {
  return (
    <UserProvider>
      <section id="app">
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignIn />} />
            <Route
              element={
                <RequireAuth>
                  <LayoutWithHeader />
                </RequireAuth>
              }
            >
              <Route path="/calender" element={<CalenderList />} />
              <Route path="/example" element={<ExamplePage />} />
            </Route>
          </Routes>
        </Router>
      </section>
    </UserProvider>
  );
}

export default App;
