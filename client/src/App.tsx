import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LoginComponent } from "./components";
import { LOGIN_PATH, TEAM_PATH } from "./constant/appPaths";
import { UserContext } from "./context/UserContext";
import { useNotification } from "./hooks/useNotification";


function App() {
  const {currentUser, setCurrentUser} = useContext(UserContext);
   const {token} = useNotification();
   
  return (
    <BrowserRouter>
        <Routes>
             <Route path="/" element={currentUser ? <Navigate to={TEAM_PATH} /> : <Navigate to={LOGIN_PATH} />} /> 
             <Route path={LOGIN_PATH} element={<LoginComponent token={token}/>}/>
             {/* <Route path={TEAM_PATH} element={<TeamComponent/>}/>
             <Route path={TRANSFER_LIST_PATH} element={<TransferListComponent/>}/> */}
             <Route path="*" element={currentUser ? <Navigate to={TEAM_PATH} /> : <Navigate to={LOGIN_PATH} />} /> 
        </Routes>
    </BrowserRouter>
  );
}

export default App;
