import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List, Avatar } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const ItemIcon = (category) => {
  switch (category) {
  case "Food":
    return <Avatar size="large" icon="rest" style={{ backgroundColor: "#ff85c0" }} />;
  case "Transport":
    return <Avatar size="large" icon="car" style={{ backgroundColor: "#5cdbd3" }} />;
  case "Movie":
    return <Avatar size="large" icon="play-square"style={{ backgroundColor: "#597ef7" }}  />;
  case "Other":
    return <Avatar size="large" icon="shopping" style={{ backgroundColor: "#ffd666" }} />;
  default:
    return <Avatar size="large" icon="rest" style={{ backgroundColor: "#ff85c0" }} />;
  }
};

const Expense = ({ dashboard, item, removeItem }) => (
  <List.Item
    actions={dashboard ? null : [
      <DeleteOutlined type="delete" onClick={removeItem(item.id)} />
    ]}
    style={{ padding: 10, marginBottom: 6, borderRadius: 10, boxShadow: " 0px 3px 16px 0px rgba(0,0,0,0.16)" }}
  >
    <List.Item.Meta
      avatar={ItemIcon(item.category)}
      title={item.remarks ? item.remarks : item.category}
      description={(new Date(item.date)).toDateString()}
    />
    <div>
      {`S$ ${formatNumber(item.amount)}`}
    </div>
  </List.Item>
);

Expense.propTypes = {
  dashboard: PropTypes.bool,
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func,
};

export default Expense;