import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import { Pie } from "react-chartjs-2";
import { Empty } from 'antd';
import { categories } from "../../constants/ExpenseCategories";
import useAuthStore from "../../store/authStore";

const categoryLabels = categories.map((category) => category.value.toLowerCase());
const categoryColors = categories.map((category) => category.color);

function MonthBreakdown() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    if (!uid) {
      setCategoryData([]);
      return;
    }

    const getCurrentMonthItems = async () => {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const snapshot = await firebase.database().ref(`users/${uid}/${year}/${month}`).once("value");
      if (snapshot.exists()) {
        const result = snapshot.val();
        const data = computeCategoryData(result.items);
        setCategoryData(data);
      }
    };

    const computeCategoryData = (items) => {
      if (items) {
        const allItems = Object.values(items);
        const groupAmtByCategory = allItems.reduce((result, item) => {
          const category = item.category.toLowerCase();
          result[category] = result[category] || [];
          result[category].push(item.amount);
          return result;
        }, {});

        return categories.map((category) => {
          const amounts = groupAmtByCategory[category.value.toLowerCase()] || [];
          const amountSum = amounts.reduce((acc, curr) => acc + curr, 0);
          return parseFloat(amountSum.toFixed(2));
        });
      }
      return [];
    };

    getCurrentMonthItems();
  }, [uid]);

  if (categoryData.length === 0) return <Empty />;

  const chartData = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Category Breakdown',
        data: categoryData,
        backgroundColor: categoryColors,
        borderColor: categoryColors,
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} height={150} />;
}

export default MonthBreakdown;