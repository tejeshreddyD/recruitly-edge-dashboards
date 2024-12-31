import { useEffect, useState } from "react";
import { Alert, Modal, Spin } from "antd";

import PlannerDrillDownData from "@components/weekplanner/drilldown/PlannerDrillDownData.jsx";


const PlannerDrillDownModal = ({modalVisible = false, type="TODAY", date=0, filterType="ALL",viewType="FULL_DAY", data = [], onDetailViewClose}) => {
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoadError, setDataLoadError] = useState(null);
  const [plannerDetailVisible, setPlannerDetailVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    //TODO load data based on type and filter..

    setTimeout(() => {
      setLoading(false);
      setContent(`${type} of ${filterType}`);
    },2000);
  },[type,filterType]);

  useEffect(() => {
    setPlannerDetailVisible(modalVisible);
    setTitle(type);
  }, [modalVisible,type]);

  const handlePlannerClose = () =>{
    setPlannerDetailVisible(false);

    if(onDetailViewClose){
      onDetailViewClose();
    }
  }

  const [title, setTitle] = useState("Today");
  
  return (<Modal
      width="90vw"
      style={{ top: 20 }}
      title={title}
      open={plannerDetailVisible}
      onCancel={handlePlannerClose}
      footer={null}
    >
      {loading ? (
        <Spin tip="Loading...">
          <div style={{ minHeight: "100px" }} />
        </Spin>
      ) : dataLoadError ? (
        <Alert message={dataLoadError} type="error" showIcon />
      ) : (
        <PlannerDrillDownData type={type} date={date} data={data} filterType={filterType} viewType={viewType} />
      )}
    </Modal>
  )
}

export default PlannerDrillDownModal;