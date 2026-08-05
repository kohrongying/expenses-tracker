import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/database";
import { Bar } from "react-chartjs-2";
import useAuthStore from "../../store/authStore";

const year = new Date().getFullYear();
const month = new Date().getMonth();
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function ExpensesSummary() {
  const uid = useAuthStore((state) => state.user?.uid || "");
  const [months, setMonths] = useState([]);
  const [monthLabels, setMonthLabels] = useState([]);

  useEffect(() => {
    if (!uid) {
      setMonths([]);
      setMonthLabels([]);
      return;
    }

    const getMonths = async (yearRef, num) =>
      firebase
        .database()
        .ref(`users/${uid}/${yearRef}`)
        .limitToLast(num)
        .once("value");

    const getTotalExpense = (items) => {
      if (items) {
        const totalExp = Object.values(items)
          .map((item) => item.amount)
          .reduce((accumulator, curr) => accumulator + curr, 0);
        return parseFloat(totalExp.toFixed(2));
      }
      return 0;
    };

    const loadData = async () => {
      const newMonths = [];
      const newLabels = [];

      if (month <= 4) {
        const snapshot = await getMonths(year, month + 1);
        const result = snapshot.val();
        for (let i = 0; i < month + 1; i += 1) {
          if (result && i in result) {
            newMonths.push(getTotalExpense(result[i].items));
          } else {
            newMonths.push(0);
          }
          newLabels.push(`${monthNames[i]} ${year}`);
        }

        const remainingMonths = 6 - month - 1;
        const prevSnapshot = await getMonths(year - 1, remainingMonths);
        const prevResult = prevSnapshot.val();
        for (let i = 11; i >= 12 - remainingMonths; i -= 1) {
          if (prevResult && i in prevResult) {
            newMonths.unshift(getTotalExpense(prevResult[i].items));
          } else {
            newMonths.unshift(0);
          }
          newLabels.unshift(`${monthNames[i]} ${year - 1}`);
        }
      } else {
        const snapshot = await getMonths(year, 6);
        if (snapshot.exists()) {
          const result = snapshot.val();
          for (let i = month - 6 + 1; i <= month; i += 1) {
            if (i in result) {
              newMonths.push(getTotalExpense(result[i].items));
            } else {
              newMonths.push(0);
            }
            newLabels.push(monthNames[i]);
          }
        }
      }

      setMonths(newMonths);
      setMonthLabels(newLabels);
    };

    loadData();
  }, [uid]);

  if (months.length === 0) return null;

  const barData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Expenses",
        backgroundColor: "#00d3ba",
        borderWidth: 1,
        hoverBackgroundColor: "#00d3ba",
        data: months,
      },
    ],
  };

  return (
    <Bar
      data={barData}
      height={150}
      options={{
        legend: { display: false },
        scales: {
          xAxes: [{ display: false, barPercentage: 0.5 }],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 75,
                gridlines: { show: false },
              },
            },
          ],
        },
      }}
    />
  );
}

export default ExpensesSummary;
