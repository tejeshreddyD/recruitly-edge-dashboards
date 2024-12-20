import { Card, Flex } from "antd";
import { useContext, useMemo, useState } from "react";
import { GrExpand } from "react-icons/gr";

const { Meta } = Card;

const TileItem = ({ id = "",icon, title, onExpand }) => {

  const [isHovered,setHovered] = useState(false);

  const renderTitle = () => {
    return (<div style={{fontSize: "16px", fontWeight: "revert" }}><Flex align={"center"} vertical={false}>{icon}{title}</Flex></div>);
  };

  const cardBodyStyles = useMemo(() => {
    return {marginLeft: "5px",paddingTop: "0"};
  },[]);

  const cardBodyMetricStyle = useMemo(() => {
    return { fontWeight: "inherit", fontSize: "32px" };
  },[])

  return (
    <>
      <Card
        hoverable
        size="small"
        style={{
          backgroundColor: "#fff",
        }}
        styles={{ body:cardBodyStyles, header: { border: "none", margin: 0 } }}
        title={renderTitle(title)}
        extra={
          <GrExpand
            title={`View ${title}`}
            style={{
              color: "gray",
              cursor: "pointer",
              display: isHovered ? "inline-block" : "none",
              transition: "opacity 0.3s"
            }}
          />
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Flex vertical={true} direction="row" align={"start"} justify={"start"}>
          <div style={cardBodyMetricStyle}>50</div>
        </Flex>
      </Card>
    </>
  );
};

export default TileItem;
