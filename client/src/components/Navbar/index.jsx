import { Button, Layout, Typography } from "antd";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router";
import { TEAM_PATH, TRANSFER_LIST_PATH } from "../../constant/appPaths";
import { NotificationContext } from "../../context/NotificationContext";
import { useLogout } from "../../hooks/useUser";

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const openNotification = useContext(NotificationContext);
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      openNotification("Logged out successfully", "You have been logged out", "success");
      navigate("/");
    } catch (error) {
      openNotification("Logout failed", "Something went wrong", "error");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        background: "#001529",
        padding: "0 24px"
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title 
            level={3} 
            style={{ 
              color: "white", 
              margin: 0,
              cursor: "pointer"
            }}
            onClick={() => navigate(TEAM_PATH)}
          >
            ⚽ Football Manager
          </Title>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Button 
            type="text" 
            style={{ color: "white" }}
            onClick={() => navigate(TEAM_PATH)}
          >
            My Team
          </Button>
          <Button 
            type="text" 
            style={{ color: "white" }}
            onClick={() => navigate(TRANSFER_LIST_PATH)}
          >
            Transfer List
          </Button>
          <Button 
            type="primary" 
            danger
            onClick={handleLogout}
            loading={logoutMutation.isPending}
          >
            Logout
          </Button>
        </div>
      </Header>
      
      <Layout.Content style={{ padding: "24px", background: "#f0f2f5" }}>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default Navbar;