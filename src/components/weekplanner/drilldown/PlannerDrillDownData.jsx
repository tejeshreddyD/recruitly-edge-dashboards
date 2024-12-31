import PlannerDailyTimeline from "@components/weekplanner/drilldown/PlannerDrilldownTimeline.jsx";
import { Col, Row } from "antd";
import PlannerJobApplicationsGrid from "@components/weekplanner/drilldown/PlannerJobApplicationsGrid.jsx";


const PlannerDrillDownData = ({type="TODAY",filterType="ALL",viewType="FULL_DAY",date = 0, data=[]}) => {

  return (
      <div className={"planner-stats-tab"} style={{height:"85vh", width:"100%",paddingTop: "10px"}}>
        <Row gutter={12}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            <PlannerDailyTimeline items={data} filterType={filterType} />
          </Col>
          <Col xs={24} sm={24} md={18} lg={18} xl={18}>
            <PlannerJobApplicationsGrid/>
          </Col>
        </Row>

      </div>);
}

export default PlannerDrillDownData;