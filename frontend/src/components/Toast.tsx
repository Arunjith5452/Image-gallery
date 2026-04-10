import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X, Info, AlertTriangle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ConfirmDialog {
  id: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  title?: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
  confirmDialog: ConfirmDialog | null;
  closeConfirm: () => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast, confirmDialog, closeConfirm }) => {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '350px'
      }}>
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>

      {confirmDialog && (
        <ConfirmDialogComponent dialog={confirmDialog} onClose={closeConfirm} />
      )}
    </>
  );
};

const ToastNotification: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} color="#10b981" />;
      case 'error':
        return <XCircle size={20} color="#ef4444" />;
      case 'info':
        return <Info size={20} color="#3b82f6" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
    }
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: `2px solid ${getBorderColor()}`,
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        animation: 'slideIn 0.3s ease-out',
        backdropFilter: 'blur(10px)'
      }}
    >
      {getIcon()}
      <p style={{ flex: 1, margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

const ConfirmDialogComponent: React.FC<{ dialog: ConfirmDialog; onClose: () => void }> = ({ dialog, onClose }) => {
  const handleConfirm = () => {
    dialog.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-out',
        backdropFilter: 'blur(4px)'
      }}
      onClick={handleCancel}
    >
      <div
        style={{
          background: 'var(--card-bg)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'scaleIn 0.3s ease-out',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={24} color="#ef4444" />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            {dialog.title || 'Confirm Action'}
          </h3>
        </div>

        <p style={{
          margin: '0 0 24px 0',
          color: 'var(--text-secondary)',
          fontSize: '0.95rem',
          lineHeight: '1.5'
        }}>
          {dialog.message}
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#ef4444',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
