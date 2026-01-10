import React from 'react';

const spinnerStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #2a65f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  small: {
    width: '20px',
    height: '20px',
    borderWidth: '2px',
  },
  large: {
    width: '60px',
    height: '60px',
    borderWidth: '4px',
  },
  fullPage: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
};

// Add keyframe animation via a style tag
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (!document.head.querySelector('style[data-spinner]')) {
  styleSheet.setAttribute('data-spinner', 'true');
  document.head.appendChild(styleSheet);
}

const Spinner = ({ size = 'medium', fullPage = false, style = {} }) => {
  const computedSpinnerStyle = {
    ...spinnerStyles.spinner,
    ...(size === 'small' && spinnerStyles.small),
    ...(size === 'large' && spinnerStyles.large),
    ...style,
  };

  const containerStyle = fullPage 
    ? spinnerStyles.fullPage 
    : spinnerStyles.container;

  return (
    <div style={containerStyle}>
      <div style={computedSpinnerStyle} />
    </div>
  );
};

export const LoadingOverlay = ({ message = 'Loading...' }) => (
  <div style={spinnerStyles.fullPage}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        ...spinnerStyles.spinner,
        ...spinnerStyles.large,
        margin: '0 auto 16px',
      }} />
      <p style={{
        margin: 0,
        fontSize: '16px',
        color: '#4a5568',
        fontWeight: 500,
      }}>
        {message}
      </p>
    </div>
  </div>
);

export default Spinner;