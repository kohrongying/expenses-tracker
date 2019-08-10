import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List, Avatar, Icon, Row, Col } from "antd";

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

const Expense = ({ item, removeItem }) => (
  <Row style={{ backgroundColor: "white", marginBottom: 6 }}>
    <Col
      xs={{ span: 20, offset: 2 }}
      lg={{ span: 16, offset: 4 }}
    >
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
    </Col>
  </Row>
);

Expense.propTypes = {
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default Expense;