
import React from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There is currently no data matching your query.',
  onEmptyAction,
  emptyActionLabel,
  pagination,
  sortConfig,
}) => {
  return (
    <div className="bg-white overflow-hidden border border-slate-200 rounded-2xl shadow-sm flex flex-col">

      {/* Scrollable Table */}
      <div className="w-full overflow-x-auto relative">
        <table className="w-full text-left text-sm text-slate-600 border-collapse min-w-[640px]">

          {/* Table Header */}
          <thead className="bg-blue-50 text-xs uppercase font-semibold text-slate-600 border-b border-slate-200 tracking-wider">
            <tr>
              {columns.map((col, idx) => {
                const isSortable = col.sortable && sortConfig;
                const isSorted = sortConfig?.key === col.key;

                return (
                  <th
                    key={col.key || idx}
                    scope="col"
                    className={`py-4 px-4 sm:px-6 whitespace-nowrap ${
                      col.headerClassName || ''
                    } ${
                      isSortable
                        ? 'cursor-pointer select-none hover:text-blue-700'
                        : ''
                    }`}
                    onClick={
                      isSortable
                        ? () => sortConfig.onSort(col.key)
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>

                      {isSortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <Loader size="md" text="Loading records..." />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionLabel={emptyActionLabel}
                    onAction={onEmptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  className="hover:bg-blue-50/60 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={`py-3.5 px-4 sm:px-6 align-middle text-sm ${
                        col.className || ''
                      }`}
                    >
                      {col.render
                        ? col.render(row, rowIdx)
                        : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 gap-3 text-xs sm:text-sm">

          <div className="text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-900">
              {(pagination.page - 1) * pagination.limit +
                (data.length > 0 ? 1 : 0)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-900">
              {(pagination.page - 1) * pagination.limit + data.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900">
              {pagination.total}
            </span>{' '}
            entries
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() =>
                pagination.onPageChange(pagination.page - 1)
              }
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs px-2 font-medium text-slate-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={
                pagination.page >= pagination.totalPages || loading
              }
              onClick={() =>
                pagination.onPageChange(pagination.page + 1)
              }
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
