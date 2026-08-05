import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  List,
  Collapse,
  Modal,
  InputNumber,
  Input,
  Row,
  Col,
  Avatar,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { ref, onValue, remove, push, update } from "firebase/database";
import { signOut } from "firebase/auth";
import { db, auth } from "../../firebase";
import Container from "../UI/Container";
import useAuthStore from "../../store/authStore";
import { formatNumber } from "../../helpers/common";

const { Panel } = Collapse;

function Profile() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const authLogout = useAuthStore((state) => state.logout);
  const history = useHistory();

  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [expenseBudget, setExpenseBudget] = useState("");

  useEffect(() => {
    if (!uid) return;

    const profileRef = ref(db, `users/${uid}/profile`);
    const unsubscribe = onValue(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const profile = snapshot.val();
        const budget = profile.expenseBudget || "";

        setExpenseBudget(budget);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  const showBudgetModalHandler = (visible) => () => {
    setShowBudgetModal(visible);
  };

  const updateBudget = () => {
    update(ref(db, `users/${uid}/profile`), { expenseBudget }).then(() => {
      setShowBudgetModal(false);
    });
  };

  const handleSelect = (name) => (value) => {
    if (name === "amount") {
      setAmount(parseFloat(value));
    }
    if (name === "expenseBudget") {
      setExpenseBudget(parseFloat(value));
    }
  };

  const navigateHome = () => {
    history.push("/");
  };

  const logout = () => {
    signOut(auth).then(() => {
      authLogout();
      history.push("/");
    });
  };

  return (
    <React.Fragment>
      <Container>
        <ArrowLeftOutlined onClick={navigateHome} />
        <h3 style={{ paddingTop: 20 }}>Profile</h3>

        <Row type="flex" justify="center">
          <Col
            style={{
              padding: 15,
              borderRadius: "50%",
              backgroundColor: "#5cdbd3",
              marginBottom: 20,
            }}
          >
            <UserOutlined style={{ fontSize: 60 }} />
          </Col>
        </Row>

        <Collapse bordered={false} expandIconPosition="right">
          <Panel
            header="Budget"
            key="1"
            extra={
              expenseBudget === "" ? (
                <PlusOutlined onClick={showBudgetModalHandler(true)} />
              ) : (
                <EditOutlined onClick={showBudgetModalHandler(true)} />
              )
            }
          >
            <List
              dataSource={[expenseBudget]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar size="large" icon={<UserOutlined />} />}
                    title="Budget"
                    style={{ alignItems: "center" }}
                  />
                  <div>{item ? `S$ ${formatNumber(item)}` : "Not set yet"}</div>
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>

        <Modal
          title={modalTitle}
          centered
          visible={showModal}
          onOk={modalFunc}
          okButtonProps={{ disabled: source === "" || amount === 0 }}
          onCancel={showModalHandler(false)}
        >
          <Row gutter={8}>
            <Col xs={12}>
              <InputNumber
                value={amount}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={handleSelect("amount")}
              />
            </Col>

            <Col xs={12}>
              <Input
                placeholder="Source"
                value={source}
                onChange={handleChange("source")}
              />
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Update Monthly Expense Budget"
          centered
          visible={showBudgetModal}
          onOk={updateBudget}
          okButtonProps={{
            disabled: expenseBudget === "" || expenseBudget === 0,
          }}
          onCancel={showBudgetModalHandler(false)}
        >
          <InputNumber
            value={expenseBudget}
            style={{ width: "100%" }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            onChange={handleSelect("expenseBudget")}
          />
        </Modal>

        <div style={{ display: "flex", justifyContent: "center", margin: 30 }}>
          <Button onClick={logout}>Logout</Button>
        </div>
      </Container>
    </React.Fragment>
  );
}

export default Profile;