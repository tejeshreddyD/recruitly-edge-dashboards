import { useEffect, useState } from "react";
import { Alert, Modal, Spin } from "antd";


const PlannerDrillDownModal = ({modalVisible = false, type="Today"}) => {
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoadError, setDataLoadError] = useState(null);
  const [plannerDetailVisible, setPlannerDetailVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    //TODO load data based on type..
  },[type]);

  useEffect(() => {
    setPlannerDetailVisible(modalVisible);
  }, [modalVisible,type]);

  const handlePlannerClose = () =>{
    setPlannerDetailVisible(false);
  }
  
  return (<Modal
    width="80vw"
    style={{ top: 20 }}
    title="Planner"
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
      <div style={{ minHeight: "500px" }}>{content}</div>
    )}
  </Modal>)
}

export default PlannerDrillDownModal;