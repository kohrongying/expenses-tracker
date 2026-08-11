import React from "react";
import PropTypes from "prop-types";
import Container from "./Container";
import Header from "./Header";

const GeneralForm = ({
  navigateHome,
  title,
  handleSubmit,
  placeholderText,
  amount,
  source,
  onAmountChange,
  onSourceChange,
  submitting,
}) => (
  <Container>
    <div className="flex items-center gap-3 mb-6">
      <button
        type="button"
        onClick={navigateHome}
        className="text-xl text-slate-700 hover:text-slate-900 cursor-pointer"
      >
        ←
      </button>
      <Header title={title} />
    </div>

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
          <span className="text-slate-500">$</span>
          <input
            value={amount}
            onChange={onAmountChange}
            className="ml-2 w-full bg-transparent outline-none"
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">{placeholderText}</label>
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">i</span>
          <input
            value={source}
            onChange={onSourceChange}
            className="w-full rounded-2xl bg-transparent pl-10 pr-3 py-3 outline-none"
            placeholder={placeholderText}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-slate-900 px-6 py-3 text-white font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Saving..." : "Save"}
      </button>
    </form>
  </Container>
);

GeneralForm.propTypes = {
  navigateHome: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  placeholderText: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  source: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  onSourceChange: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

GeneralForm.defaultProps = {
  submitting: false,
};

export default GeneralForm;
