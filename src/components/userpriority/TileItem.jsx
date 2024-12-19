import { Card, Flex } from "antd";

const { Meta } = Card;

const TileItem = ({ id = "",icon, title }) => {

  const renderTitle = () => {
    return (<div style={{ padding: "5px", paddingTop: "0 !important", fontSize: "20px", fontWeight: "revert" }}><Flex align={"center"} vertical={false}>{icon}{title}</Flex></div>);
  };

  return (
    <>
      <Card
        hoverable
        size="small"
        style={{
          backgroundColor: "#fff",
        }}
        styles={{ body: { padding: 0 }, header: { border: "none", margin: 0 } }}
        title={renderTitle(title)}
      >
        <Flex vertical={true} direction="row" align={"center"} justify="center">
          <div style={{ fontWeight: 350, fontSize: "50px" }}>50</div>
        </Flex>
      </Card>
    </>
  );
};

export default TileItem;
