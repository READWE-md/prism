import { Routes, Route, BrowserRouter } from "react-router-dom";
import axios from "axios";
import Camera from "./pages/Camera";
import Result from "./pages/Result";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Gallery from "./pages/Gallery";
import EditPage from "./pages/EditPage";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import CheckList from "./pages/CheckList";
import { Provider } from "react-redux";
import persistor, { store } from "./reducer";
import { PersistGate } from "redux-persist/integration/react";
import Share from "./pages/Share";
import styled from "styled-components";

if (process.env.REACT_APP_LOCAL === "true") {
  axios.defaults.withCredentials = false;
} else {
  axios.defaults.withCredentials = true;
}

const MainContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: gray;
`;
const SubContainer = styled.div`
  overflow-x: hidden;
  width: 100%;
  max-width: 540px;
  height: 100%;
  max-height: 1200px;
  aspect-ratio: 360 / 800;
  background-color: #f8f8f8;
  /* position: relative; */
  overflow-y: auto;
  /* WebKit 기반 브라우저에서 스크롤바 숨기기 */
  ::-webkit-scrollbar {
    display: none;
  }
  /* Gecko 기반 브라우저에서 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
`;

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MainContainer>
          <SubContainer className="App" id="SubContainer">
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth/kakao/callback" element={<Auth />} />
                <Route path="/main" element={<Main />} />
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
                <Route path="/share/:roomId" element={<Share />} />
              </Routes>
            </BrowserRouter>
          </SubContainer>
        </MainContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
