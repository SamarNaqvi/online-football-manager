import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import {
  LoginComponent,
  Navbar,
  ProtectedRoute,
  ErrorBoundary,
  Loader,
} from "./components";
import { LOGIN_PATH, TEAM_PATH, TRANSFER_LIST_PATH } from "./constant/appPaths";
import { useNotification } from "./hooks/useNotification";
import { useUser } from "./hooks/useUser";
import { lazy, Suspense } from "react";

const TeamComp = lazy(() => import("./components/TeamComponent"));
const TransferComp = lazy(() => import("./components/TransferListComponent"));

function App() {
  const { data: currentUser } = useUser();
  const { token, notification } = useNotification();

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                <Navigate to={TEAM_PATH} />
              ) : (
                <Navigate to={LOGIN_PATH} />
              )
            }
          />
          <Route
            path={LOGIN_PATH}
            element={
              currentUser ? (
                <Navigate to={TEAM_PATH} />
              ) : (
                <LoginComponent token={token} />
              )
            }
          />

          <Route path="/" element={<Navbar />}>
            <Route
              path={TEAM_PATH}
              element={
                <Suspense fallback={<Loader />}>
                  <ProtectedRoute
                    user={currentUser}
                    Component={<TeamComp notification={notification} />}
                  />
                </Suspense>
              }
            />
            <Route
              path={TRANSFER_LIST_PATH}
              element={
                <Suspense fallback={<Loader />}>
                  <ProtectedRoute
                    Component={<TransferComp />}
                    user={currentUser}
                  />
                </Suspense>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              currentUser ? (
                <Navigate to={TEAM_PATH} />
              ) : (
                <Navigate to={LOGIN_PATH} />
              )
            }
          />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
