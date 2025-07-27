import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { useTeam } from "../../hooks/useTeam";
import { useUser } from "../../hooks/useUser";
import { buyPlayerApi, fetchPlayer } from "../../service";
import Loader from "../GenericLoader";
import Player from "../Player";

const { Title } = Typography;

function TransferListComponent({notification}) {
  const [queryString, setQueryString] = useState("");
  const { data: currentUser } = useUser();
  const openNotification = useContext(NotificationContext);
  const {
    data: transferData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["transfer-players", queryString],
    queryFn: () => fetchPlayer(queryString),
    enabled: !!queryString || queryString === "",
    select: (resp) => resp?.data,
  });

  const buyPlayerMutation = useMutation({
    mutationFn: buyPlayerApi,
    onSuccess: () => {
      // Refetch transfer list after buying
      refetch();
    },
  });

  const { data: teamData } = useTeam(currentUser?.email);
  const players = transferData?.players ?? [];

  const onFinish = (values) => {
    let updatedQueryString = "";
    Object.entries(values).forEach((val, index) => {
      if (val[1]?.length > 0) {
        updatedQueryString += `${val[0]}=${val[1]}&`;
      }
    });

    setQueryString(updatedQueryString.slice(0, updatedQueryString.length - 1));
  };

  const buyPlayer = async (playerTeamId, playerId, playerName) => {
    try {
      await buyPlayerMutation.mutateAsync({
        teamId: teamData?.id,
        playerId,
        playerTeamId,
      });
    } catch (exception) {

      openNotification(
        "Buy Player Process Failed",
        exception?.response?.data?.message,
        "error"
      );
    }
  };

  useEffect(()=>{

    if(notification?.type === "change-status" || notification?.type === "buy-player")
      {
        setTimeout(()=>{
        refetch();
      },[1000]);
      }
  },[notification?.type]);

  useEffect(() => {
    refetch();
  }, [queryString]);

  return (
    <div style={{ padding: "2rem", height: "100%", background:"#acd4f8ff" }}>
      <Title>Transfer Market</Title>
      <Form
        name="filters"
        onFinish={onFinish}
        layout="horizontal"
        autoComplete="off"
      >
        <Flex gap={10}>
          <Form.Item name="teamName">
            <Input size="large" placeholder="Search Team Name" />
          </Form.Item>
          <Form.Item name="playerName">
            <Input size="large" placeholder="Search Player Name" />
          </Form.Item>
          <Form.Item
            name="price"
            rules={[
              {
                pattern: /^\d+(\.\d{1,2})?$/,
                message: "Please enter a valid number",
              },
            ]}
          >
            <Input size="large" placeholder="Enter Price" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              block
              loading={isLoading}
            >
              Search
            </Button>
          </Form.Item>
        </Flex>
      </Form>
      {isLoading ? (
        <Loader />
      ) : (
        <Flex
          gap={80}
          wrap
          style={{ marginTop: "20px", background: "transparent" }}
          align="center"
          justify="start"
        >
          {players &&
            players?.map((player) => (
              <Player player={player} onClick={buyPlayer} />
            ))}
        </Flex>
      )}
    </div>
  );
}

export default TransferListComponent;
