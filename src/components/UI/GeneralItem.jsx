import React from "react";
import { formatCentsToString } from "../../lib/common";

const GeneralItem = ({ item, removeItem }) => (
  <div className="flex items-center justify-between gap-4 p-4 mb-3 rounded-3xl shadow-md bg-white">
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-slate-900 text-xl">
        $ 
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{item.source}</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-base font-semibold text-slate-900">S$ {formatCentsToString(item.amountInCents)}</div>
      <button
        type="button"
        onClick={removeItem(item.id)}
        className="text-slate-500 hover:text-red-600 cursor-pointer"
      >
        🗑️
      </button>
    </div>
  </div>
);

export default GeneralItem;
