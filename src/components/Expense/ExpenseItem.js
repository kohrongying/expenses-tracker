import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List, Avatar, Icon } from "antd";

const ItemIcon = (category) => {
  switch (category) {
  case "Food":
    return <Avatar size="large" icon="coffee" />;
  case "Transport":
    return <Avatar size="large" icon="car" />;
  case "Movie":
    return <Avatar size="large" icon="play-square" />;
  case "Others":
    return <Avatar size="large" icon="shopping" />;
  default:
    return <Avatar size="large" icon="user" />;
  }
};

const Expense = ({ item, removeItem }) => (
  <List.Item
    actions={[
      <Icon key="delete" type="delete" onClick={removeItem(item.id)} />
    ]}
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
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default Expense;