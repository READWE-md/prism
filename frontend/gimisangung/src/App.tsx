import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
import Camera from "./pages/Camera";
import Result from "./pages/Result";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import EditPage from "./pages/EditPage";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import CheckList from "./pages/CheckList";
import { Provider } from "react-redux";
import persistor, { store } from "./reducer";
import { PersistGate } from "redux-persist/integration/react";

if (process.env.REACT_APP_LOCAL === "true") {
  axios.defaults.withCredentials = false;
} else {
  axios.defaults.withCredentials = true;
}

function App() {
  const theme = createTheme();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth/kakao/callback" element={<Auth />} />
                <Route path="/home" element={<Home />} />
                <Route path="/result" element={<Result />} />
                <Route path="/camera" element={<Camera />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/result" element={<Result />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/edit" element={<EditPage />} />
                <Route path="/search" element={<Search />} />
                <Route path="/checklist" element={<CheckList />} />
              </Routes>
            </BrowserRouter>
          </div>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
