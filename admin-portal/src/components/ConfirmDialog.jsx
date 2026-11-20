
import React from 'react';
import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This operation cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">

        {/* Warning Message */}
        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-full shrink-0 ${
              isDanger
                ? 'bg-red-50 border border-red-100 text-red-600'
                : 'bg-blue-50 border border-blue-100 text-blue-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <p className="text-sm text-slate-600 leading-relaxed pt-1">
            {message}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">

          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs sm:text-sm font-medium hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-white text-xs sm:text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 outline-none ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500'
            }`}
          >
            {isLoading && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            {confirmText}
          </button>

        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
