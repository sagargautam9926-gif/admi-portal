import React from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There is currently no data matching your query.',
  onEmptyAction,
  emptyActionLabel,
  pagination, // { page, totalPages, total, limit, onPageChange }
  sortConfig, // { key, direction, onSort }
}) => {
  return (
    <div className="card-gradient overflow-hidden border border-border-blue/60 shadow-xl flex flex-col">
      {/* Scrollable table container */}
      <div className="w-full overflow-x-auto relative">
        <table className="w-full text-left text-sm text-brand-text border-collapse min-w-[640px]">
          <thead className="bg-[#07174d] text-xs uppercase font-semibold text-brand-cyan/90 border-b border-border-blue tracking-wider">
            <tr>
              {columns.map((col, idx) => {
                const isSortable = col.sortable && sortConfig;
                const isSorted = sortConfig?.key === col.key;

                return (
                  <th
                    key={col.key || idx}
                    scope="col"
                    className={`py-3.5 px-4 sm:px-6 whitespace-nowrap ${
                      col.headerClassName || ''
                    } ${isSortable ? 'cursor-pointer select-none hover:text-white' : ''}`}
                    onClick={isSortable ? () => sortConfig.onSort(col.key) : undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="text-brand-muted">
                          {isSorted ? (
                            sortConfig.direction === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-brand-cyan" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-brand-cyan" />
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

          <tbody className="divide-y divide-border-blue/30 bg-navy-900/30">
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
                  className="hover:bg-navy-800/50 transition-colors duration-150 group"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className={`py-3.5 px-4 sm:px-6 align-middle text-sm ${
                        col.className || ''
                      }`}
                    >
                      {col.render ? col.render(row, rowIdx) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3.5 border-t border-border-blue/50 bg-[#061444]/60 gap-3 text-xs sm:text-sm">
          <div className="text-brand-muted">
            Showing{' '}
            <span className="font-semibold text-white">
              {(pagination.page - 1) * pagination.limit + (data.length > 0 ? 1 : 0)}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-white">
              {(pagination.page - 1) * pagination.limit + data.length}
            </span>{' '}
            of <span className="font-semibold text-white">{pagination.total}</span>{' '}
            entries
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-border-blue bg-navy-850 text-brand-text hover:text-white hover:border-brand-cyan disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-brand-cyan outline-none"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs px-2 font-medium text-brand-text">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-border-blue bg-navy-850 text-brand-text hover:text-white hover:border-brand-cyan disabled:opacity-40 disabled:cursor-not-allowed transition-all focus-visible:ring-2 focus-visible:ring-brand-cyan outline-none"
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

