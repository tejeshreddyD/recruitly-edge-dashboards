import React from "react";
import { Checkbox } from "antd";
import { Drawer } from 'antd';

const onChange = (checkedValues) => {
  console.log("checked = ", checkedValues);
};
const options = [
  {
    label: "Apple",
    value: "Apple"
  },
  {
    label: "Pear",
    value: "Pear"
  },
  {
    label: "Orange",
    value: "Orange"
  }
];
const GoalSelector = ({ apiKey, apiServer, userId, tenantId, open, onClose }) => {
  return (
    <Drawer title="Customise Goals" onClose={onClose} open={open}>
      <Checkbox.Group options={options}
                      style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                      onChange={onChange} />
    </Drawer>
  );
};
export default GoalSelector;