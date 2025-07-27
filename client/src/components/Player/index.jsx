import { Button, Card, Flex, Image, Typography } from "antd";
import { useUser } from "../../hooks/useUser";
const { Title } = Typography;

function Player({ player, onClick, teamsPage }) {
  const { data: currentUser } = useUser();
  const isOnTransferList = player?.isOnTransferList;
  const teamName = player?.team?.name;
  const isOwnPlayer = player?.team?.user?.email === currentUser?.email;
 
  return (
    <Card style={{ width: "25rem", height:"22rem" }}>
      <Flex vertical align="center">
        <Image src={player?.picture} />
      </Flex>

      <Flex align="baseline" justify="space-between">
        <Title level={4}>{player?.name}</Title>
        {teamName && <Title level={4}>{teamName}</Title>}
      </Flex>
      <Flex
        align="center"
        justify="space-between"
        style={{ margin: "10px 0px" }}
      >
        <div>
          <span style={{ fontWeight: 500 }}>Price:</span> {player?.price}
        </div>
        <div>
          <span style={{ fontWeight: 500 }}>Role:</span> {player?.role}
        </div>
      </Flex>
      {teamsPage ? (
        <Button
          variant="solid"
          color={isOnTransferList ? "danger" : "primary"}
          onClick={() => onClick(player?.id, isOnTransferList)}
        >
          {`${isOnTransferList ? "Remove from" : "Add to"}`} Transfer List
        </Button>
      ) : (
        !isOwnPlayer && (
          <Button variant="solid" color={"primary"} onClick={()=>onClick(player?.teamId, player?.id, player?.name)}>
            Buy Player
          </Button>
        )
      )}
    </Card>
  );
}

export default Player;
