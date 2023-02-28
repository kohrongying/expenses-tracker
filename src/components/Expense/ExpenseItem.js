import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List, Avatar } from "antd";
import { DeleteOutlined, RestOutlined, CarOutlined, ShoppingOutlined, PlayCircleOutlined, ShopOutlined } from "@ant-design/icons";
import Colors from "../../constants/Colors";

const ItemIcon = (category) => {
  switch (category) {
  case "Food":
    return <Avatar size="large" icon={<RestOutlined />} style={{ backgroundColor: Colors.pink }} />;
  case "Groceries":
    return <Avatar size="large" icon={<ShopOutlined />} style={{ backgroundColor: Colors.purple }} />;  
  case "Transport":
    return <Avatar size="large" icon={<CarOutlined />} style={{ backgroundColor: Colors.green }} />;
  case "Movie":
    return <Avatar size="large" icon={<PlayCircleOutlined />} style={{ backgroundColor: Colors.blue }}  />;
  case "Other":
    return <Avatar size="large" icon={<ShoppingOutlined />} style={{ backgroundColor: Colors.yellow }} />;
  default:
    return <Avatar size="large" icon={<RestOutlined />} style={{ backgroundColor: Colors.pink }} />;
  }
};

const Expense = ({ dashboard, item, removeItem }) => (
  <List.Item
    actions={dashboard ? null : [
      <DeleteOutlined key={`delete-item${item.id}`} type="delete" onClick={removeItem(item.id)} />
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