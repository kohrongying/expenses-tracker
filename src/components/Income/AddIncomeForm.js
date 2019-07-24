import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const AddIncomeForm = (props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Income Source"
          type="text"
          value={props.source}
          onChange={props.handleChange("incomeSource")}
          fullWidth
        />
        <TextField
          label="Amount"
          type="number"
          value={props.value}
          onChange={props.handleChange("amount")}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={props.handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddIncomeForm.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};

export default AddIncomeForm;