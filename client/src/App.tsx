import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { LoginComponent, TeamComponent, TransferListComponent } from "./components";
import { LOGIN_PATH, TEAM_PATH, TRANSFER_LIST_PATH } from "./constant/appPaths";
import { useNotification } from "./hooks/useNotification";
import { useUser } from "./hooks/useUser";

function App() {
  const { data: currentUser } = useUser();
  const {token, notification} = useNotification();
   
  return (
    <BrowserRouter>
        <Routes>
             <Route path="/" element={currentUser ? <Navigate to={TEAM_PATH} /> : <Navigate to={LOGIN_PATH} />} /> 
             <Route path={LOGIN_PATH} element={currentUser ? <Navigate to={TEAM_PATH}/> : <LoginComponent token={token}/>}/>
             
             <Route path={TEAM_PATH} element={<TeamComponent notification={notification}/>}/>
             <Route path={TRANSFER_LIST_PATH} element={<TransferListComponent/>}/> 
             <Route path="*" element={currentUser ? <Navigate to={TEAM_PATH} /> : <Navigate to={LOGIN_PATH} />} /> 
        </Routes>
    </BrowserRouter>
  );
}

export default App;
