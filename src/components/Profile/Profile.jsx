import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import "firebase/auth";
import { useHistory } from "react-router-dom";
import { Button, List, Collapse, Modal, InputNumber, Input, Row, Col, Avatar } from "antd";
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UserOutlined, DollarOutlined } from "@ant-design/icons";
import Container from "../UI/Container";
import useAuthStore from "../../store/authStore";
import { formatNumber } from "../../helpers/common";

const { Panel } = Collapse;

function Profile() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const authLogout = useAuthStore((state) => state.logout);
  const history = useHistory();

  const [income, setIncome] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalFunc, setModalFunc] = useState(() => () => {});
  const [amount, setAmount] = useState(0);
  const [source, setSource] = useState("");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [expenseBudget, setExpenseBudget] = useState("");

  useEffect(() => {
    if (!uid) return;

    const ref = firebase.database().ref(`users/${uid}/profile`);
    const handleValue = (snapshot) => {
      if (snapshot.exists()) {
        const profile = snapshot.val();
        const incomeItems = profile.monthlyIncome || {};
        const investmentItems = profile.monthlyInvestments || {};
        const budget = profile.expenseBudget || "";

        const incomeList = Object.keys(incomeItems).map((key) => {
          const item = incomeItems[key];
          item.id = key;
          return item;
        });

        const investmentList = Object.keys(investmentItems).map((key) => {
          const item = investmentItems[key];
          item.id = key;
          return item;
        });

        setIncome(incomeList);
        setInvestments(investmentList);
        setExpenseBudget(budget);
      }
    };

    ref.on("value", handleValue);
    return () => ref.off("value", handleValue);
  }, [uid]);

  const removeIncome = (id) => () => {
    firebase.database().ref(`users/${uid}/profile/monthlyIncome/${id}`).remove();
  };

  const removeInvestment = (id) => () => {
    firebase.database().ref(`users/${uid}/profile/monthlyInvestments/${id}`).remove();
  };

  const showBudgetModalHandler = (visible) => () => {
    setShowBudgetModal(visible);
  };

  const showModalHandler = (visible) => () => {
    setShowModal(visible);
  };

  const showModalIncome = () => {
    setModalTitle("Add Recurring Income");
    setModalFunc(() => addRecurringItem("monthlyIncome"));
    setShowModal(true);
  };

  const showModalInvestment = () => {
    setModalTitle("Add Recurring Investment");
    setModalFunc(() => addRecurringItem("monthlyInvestments"));
    setShowModal(true);
  };

  const addRecurringItem = (ref) => async () => {
    await firebase.database().ref(`users/${uid}/profile/${ref}`).push({
      amount,
      source,
    });
    setAmount(0);
    setSource("");
    setShowModal(false);
  };

  const updateBudget = () => {
    firebase.database().ref(`users/${uid}/profile`).update({ expenseBudget }).then(() => {
      setShowBudgetModal(false);
    });
  };

  const handleChange = (name) => (event) => {
    if (name === "source") {
      setSource(event.target.value);
    }
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
    firebase.auth().signOut().then(() => {
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
          <Col style={{ padding: 15, borderRadius: "50%", backgroundColor: "#5cdbd3", marginBottom: 20 }}>
            <UserOutlined style={{ fontSize: 60 }} />
          </Col>
        </Row>

        <Collapse bordered={false} expandIconPosition="right">
          <Panel header="Budget" key="1" extra={expenseBudget === "" ? <PlusOutlined onClick={showBudgetModalHandler(true)} /> : <EditOutlined onClick={showBudgetModalHandler(true)} />}>
            <List
              dataSource={[expenseBudget]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta avatar={<Avatar size="large" icon={<UserOutlined />} />} title="Budget" style={{ alignItems: "center" }} />
                  <div>{item ? `S$ ${formatNumber(item)}` : "Not set yet"}</div>
                </List.Item>
              )}
            />
          </Panel>

          <Panel header="Recurring Income" key="2" extra={<PlusOutlined onClick={showModalIncome} />}>
            <List
              dataSource={income}
              renderItem={(item) => (
                <List.Item actions={[<DeleteOutlined key={`delete-item${item.id}`} type="delete" onClick={removeIncome(item.id)} />]}>
                  <List.Item.Meta avatar={<Avatar size="large" icon={<DollarOutlined />} />} title={item.source} style={{ alignItems: "center" }} />
                  <div>{`S$ ${formatNumber(item.amount)}`}</div>
                </List.Item>
              )}
            />
          </Panel>

          <Panel header="Recurring investments" key="3" extra={<PlusOutlined onClick={showModalInvestment} />}>
            <List
              dataSource={investments}
              renderItem={(item) => (
                <List.Item actions={[<DeleteOutlined key={`delete-item${item.id}`} type="delete" onClick={removeInvestment(item.id)} />]}>
                  <List.Item.Meta avatar={<Avatar size="large" icon={<DollarOutlined />} />} title={item.source} style={{ alignItems: "center" }} />
                  <div>{`S$ ${formatNumber(item.amount)}`}</div>
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
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                onChange={handleSelect("amount")}
              />
            </Col>

            <Col xs={12}>
              <Input placeholder="Source" value={source} onChange={handleChange("source")} />
            </Col>
          </Row>
        </Modal>

        <Modal
          title="Update Monthly Expense Budget"
          centered
          visible={showBudgetModal}
          onOk={updateBudget}
          okButtonProps={{ disabled: expenseBudget === "" || expenseBudget === 0 }}
          onCancel={showBudgetModalHandler(false)}
        >
          <InputNumber
            value={expenseBudget}
            style={{ width: "100%" }}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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