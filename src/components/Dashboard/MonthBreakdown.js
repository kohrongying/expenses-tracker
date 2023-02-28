import React, { Component } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/app";
import "firebase/database";
import { connect } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Empty } from 'antd';
import { categories } from "../../constants/ExpenseCategories";

const categoryLabels = categories.map(category => category.value.toLowerCase());
const categoryColors = categories.map(category => category.color);

class MonthBreakdown extends Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
  }

  state = {
    categoryData: [],
  }

  componentDidMount() {
    this.getCurrentMonthItems().then(snapshot => {
      if (snapshot.exists()) {
        const result = snapshot.val()
        const categoryData = this.computeCategoryData(result.items)
        console.log(categoryData)
        this.setState({ categoryData })
      }
    })
  }

  getCurrentMonthItems = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    return firebase.database()
      .ref(`users/${this.props.uid}/${year}/${month}`)
      .once("value");
  }

  computeCategoryData = (items) => {
    if (items) {
      const allItems = Object.values(items);
      const groupAmtByCategory = allItems.reduce((r, a) => {
        const category = a.category.toLowerCase();
        r[category] = r[category] || [];
        r[category].push(a.amount);
        return r;
      }, {});
      console.log(groupAmtByCategory);
      const data = [];
      for (let i=0; i < categories.length; i++) {
        const category = categories[i].value.toLowerCase();
        const amounts = groupAmtByCategory[category] || [];
        const amountSum = amounts.reduce((acc, curr) => acc + curr, 0);
        data.push(parseFloat(amountSum.toFixed(2)));
      }
      return data;
    }
    return [];
  }

  render() {
    const chartData = {
      labels: categoryLabels,
      datasets: [
        {
          label: 'Category Breakdown',
          data: this.state.categoryData,
          backgroundColor: categoryColors,
          borderColor: categoryColors,
          borderWidth: 1,
        }
      ]
    }
    if (this.state.categoryData.length === 0) return <Empty />;
    
    return (
      <Pie
        data={chartData}
        height={150}
      />
    );
  }
}

const mapStateToProps = state => ({ uid: state.user.uid });

export default connect(mapStateToProps)(MonthBreakdown);