import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../../helpers/common";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";

const year = new Date().getFullYear();

const styles = {
  expenses: {
    color: "red",
    flex:1
  },
  savings: {
    color: "green",
    flex:1
  },
  summaryList: {
    flexDirection: "row",
    display: "flex",
    flex: 2
  },
  panelSummary: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%"
  }
};

const MonthItem = (props) => {
  const month = props.month;
  const rows = [
    {
      name: "Total Income",
      amount: formatNumber(month.totalIncome)
    },
    {
      name: "Total Expenses",
      amount: formatNumber(month.totalExpenses)
    },
    {
      name: "Total Investment",
      amount: formatNumber(month.totalInvestment)
    },
    {
      name: "Total Savings",
      amount: formatNumber(month.totalSavings)
    }
  ];
  return (
    <ExpansionPanel expanded={props.expanded === props.panel} onChange={props.handleChange(props.panel)}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div style={styles.panelSummary} >
          <div style={{ flex: 1 }}>{month.id}</div>
          <div style={styles.summaryList}>
            <div style={styles.expenses}>(S${formatNumber(month.totalExpenses)})</div>
            <div style={styles.savings}>S${formatNumber(month.totalSavings)}</div>
          </div>
        </div>

      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ flexDirection: "column" }}>
        <Table>
          <TableBody>
            {rows.map((row,id) => {
              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell style={{ textAlign: "right" }} align="right">S${row.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Button style={{ marginTop: 10 }} href={`/${year}/${month.id}`}>
          View More
        </Button>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

MonthItem.propTypes = {
  month: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  panel: PropTypes.string.isRequired,
  expanded: PropTypes.string,
};

export default MonthItem;