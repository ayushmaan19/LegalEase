import React, { useEffect, useCallback } from 'react';
import { FiX } from 'react-icons/fi';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out',
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e2e8f0',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a202c',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: '#718096',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, color 0.2s',
  },
  body: {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#f7fafc',
  },
  small: {
    maxWidth: '400px',
  },
  large: {
    maxWidth: '700px',
  },
  fullWidth: {
    maxWidth: '90vw',
  },
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
if (!document.head.querySelector('style[data-modal]')) {
  styleSheet.setAttribute('data-modal', 'true');
  document.head.appendChild(styleSheet);
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const contentStyle = {
    ...modalStyles.content,
    ...(size === 'small' && modalStyles.small),
    ...(size === 'large' && modalStyles.large),
    ...(size === 'fullWidth' && modalStyles.fullWidth),
  };

  return (
    <div style={modalStyles.overlay} onClick={handleOverlayClick}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        {(title || showCloseButton) && (
          <div style={modalStyles.header}>
            <h2 style={modalStyles.title}>{title}</h2>
            {showCloseButton && (
              <button
                style={modalStyles.closeButton}
                onClick={onClose}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f7fafc';
                  e.currentTarget.style.color = '#1a202c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#718096';
                }}
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        )}
        <div style={modalStyles.body}>{children}</div>
        {footer && <div style={modalStyles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;