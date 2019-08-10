import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import { List, Avatar, Icon, Row, Col, } from "antd";

const GeneralItem = ({ item, removeItem }) => (
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
          avatar={<Avatar size="large" icon="dollar" />}
          title={item.source}
          style={{ alignItems: "center" }}
        />

        <div>{`S$ ${formatNumber(item.amount)}`}</div>

      </List.Item>

    </Col>
  </Row>
);

GeneralItem.propTypes = {
  item: PropTypes.object.isRequired,
  removeItem: PropTypes.func.isRequired,
};

export default GeneralItem;