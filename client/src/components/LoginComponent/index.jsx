import { Button, Flex, Form, Input, Typography } from "antd";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { TEAM_PATH } from "../../constant/appPaths";
import { UserContext } from "../../context/UserContext";
import { loginUser } from "../../service";
import styles from "./index.module.css";

const { Title } = Typography;

const LoginComponent = ({ token }) => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signInUser = async (values) => {
    try {
      setLoading(true);
      const resp = await loginUser({ token, ...values });
      setCurrentUser(resp);
      navigate(TEAM_PATH);
    } catch (error) {
      console.error(`Something Went Wrong: ${error?.message}`);
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values) => signInUser(values);

  return (
    <Flex align="center" justify="center" style={{ height: "100vh" }}>
      <div className={styles.loginContainer}>
        <Title level={4} style={{ padding: "0rem 1rem" }}>
          Login
        </Title>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          style={{ width: "100%", padding: "0rem 1rem" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Invalid email!" },
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Flex>
  );
};

export default LoginComponent;
