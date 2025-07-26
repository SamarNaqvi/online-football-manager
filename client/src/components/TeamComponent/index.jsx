import { Flex, Form, Input, Modal, Result, Typography } from "antd";
import { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../context/NotificationContext";
import { useTeam, useUpdatePlayerTransferStatus } from "../../hooks/useTeam";
import { useUser } from "../../hooks/useUser";
import Loader from "../GenericLoader";
import Player from "../Player";

const { Title } = Typography;

function TeamComponent({ notification }) {
  const [form] = Form.useForm();
  const { data: currentUser } = useUser();
  const [modalData, setModalData] = useState(null);
  const openNotification = useContext(NotificationContext);

  const { data, isLoading, error, refetch } = useTeam(currentUser?.email);
  const updatePlayerMutation = useUpdatePlayerTransferStatus();

  const {players = [], name="", budget=""} = data ?? {};

  const canAddPLayerToTransferList = (isOnTransferList) => {
    // means we're removing player from transfer list
    if (isOnTransferList === true) {
      return true;
    }

    const nonListPlayers = data?.players?.filter(
      (player) => !Boolean(player.isOnTransferList)
    );
    if (nonListPlayers.length <= 15) {
      openNotification(
        "Can't Add Player to Transfer Market",
        "Teams should have players in 15-25 range",
        "error"
      );
      return false;
    }
    return true;
  };

  const addOrRemovePlayerFromTransferList = async (
    playerId,
    status,
    askingPrice
  ) => {
    try {
      await updatePlayerMutation.mutateAsync({
        playerId,
        status: !status,
        askingPrice,
      });
    } catch (exception) {
      console.log("exception", exception);
      openNotification(exception?.message);
    }
  };

  const modalHandler = (playerId, isOnTransferList) => {
    if (!canAddPLayerToTransferList(isOnTransferList)) return;

    const modalTitle = !isOnTransferList
      ? "Kindly set the asking Price"
      : "Are you sure you want to remove the player from transfer market";
    setModalData({
      show: true,
      playerId,
      status: isOnTransferList,
      title: modalTitle,
    });
  };

  useEffect(() => {
    notification?.type === "team-creation" && refetch();
  }, [notification?.type]);

  if (isLoading) return <Loader />;

  if (error || data?.status === "FAILED")
    return (
      <Result
        status={"error"}
        title={"Team Fetch Failed"}
        subTitle={"Unable to fetch team right now"}
      />
    );

  if (data?.status === "PENDING")
    return (
      <Result
        status={"success"}
        title={"Team Creation In Progress"}
        subTitle={
          "Your Team creation request has been queued. Please wait untill its ready"
        }
      />
    );

  return (
    <div style={{ padding: "2rem", background: "#acd4f8ff" }}>
      <Flex vertical>
        <Title level={3}>{name}</Title>
        <div style={{fontSize:"18px"}}>Budget - ${budget}</div>
      </Flex>
      <Flex
        gap={80}
        wrap
        style={{ marginTop: "20px", background: "transparent" }}
        align="center"
      >
        {players &&
          players?.map((player) => (
            <Player teamsPage player={player} onClick={modalHandler} />
          ))}
      </Flex>
      <Modal
        open={modalData?.show}
        title={modalData?.title}
        onCancel={() => setModalData(null)}
        onOk={() => {
          if (modalData?.status === true) {
            addOrRemovePlayerFromTransferList(
              modalData?.playerId,
              modalData?.status
            );
            setModalData(null);
          }
          form.submit();
        }}
      >
        <>
          {!modalData?.status && (
            <Form
              form={form}
              onFinish={(values) => {
                addOrRemovePlayerFromTransferList(
                  modalData?.playerId,
                  modalData?.status,
                  values.askingPrice
                );
                setModalData();
                form.resetFields();
              }}
            >
              <Form.Item
                name="askingPrice"
                rules={[
                  {
                    pattern: /^\d+(\.\d{1,2})?$/,
                    message: "Please enter a valid number",
                    required: true,
                  },
                ]}
              >
                <Input size="large" placeholder="Enter Asking Price" />
              </Form.Item>
            </Form>
          )}
        </>
      </Modal>
    </div>
  );
}

export default TeamComponent;
