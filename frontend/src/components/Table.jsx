import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Dropdown from "./Dropdown";


const Table = ({
  columns,
  data,
  loading = false,
  hideEmptyState = false,
  actions,
}) => {
  const allColumns =
    actions && actions.length > 0
      ? [...columns, { header: "Actions", _isActions: true }]
      : columns;

  if (loading) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container-low">
            <tr>
              {allColumns.map((col, index) => (
                <th
                  key={index}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-surface-on"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-surface-container">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="border-b border-outline-variant/30">
                {allColumns.map((col, index) => (
                  <td key={index} className="px-4 py-2.5">
                    <div className="h-3.5 bg-surface-variant/30 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    if (hideEmptyState) {
      return null;
    }
    return (
      <div className="w-full text-center py-12">
        <p className="text-surface-on-variant text-lg">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-surface-container border border-outline-variant/30 transition-colors duration-300">
      <table className="w-full">
        <thead className="bg-surface-variant border-b border-outline-variant/30">
          <tr>
            {allColumns.map((col, index) => (
              <th
                key={index}
                className={`px-4 py-2.5 text-left text-xs font-semibold text-surface-on uppercase tracking-wider ${col._isActions ? "text-center" : ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="hover:bg-primary-container/20 transition-colors duration-200"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 text-xs text-surface-on-variant whitespace-nowrap"
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
              {actions && actions.length > 0 && (
                <td className="px-4 py-2 text-xs whitespace-nowrap">
                  <div className="flex justify-center">
                    <Dropdown
                      trigger={
                        <button
                          className="p-1.5 rounded-full hover:bg-surface-variant/40 text-surface-on-variant transition-colors duration-150"
                          title="Actions"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="19" r="1.5" />
                          </svg>
                        </button>
                      }
                      actions={actions.map((a) => ({
                        ...a,
                        onClick: () => a.onClick(row),
                      }))}
                      align="right"
                    />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      render: PropTypes.func,
    }),
  ).isRequired,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  hideEmptyState: PropTypes.bool,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      className: PropTypes.string,
      icon: PropTypes.node,
    }),
  ),
};

export default Table;
