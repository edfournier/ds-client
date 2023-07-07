import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import "./index.css";

const App = () => {
    return (
        <HashRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path="landing" element={<Landing />} />
            </Routes>
        </HashRouter>
    );
}
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

export default App;