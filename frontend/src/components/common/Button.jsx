import React from 'react';

const buttonStyles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
    fontWeight: 600,
    fontSize: '15px',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  primary: {
    background: 'linear-gradient(135deg, #2a65f1 0%, #1a54d1 100%)',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(42, 101, 241, 0.25)',
  },
  secondary: {
    backgroundColor: '#ffffff',
    color: '#2d3748',
    border: '1px solid #e2e8f0',
  },
  outline: {
    backgroundColor: 'transparent',
    color: '#2a65f1',
    border: '2px solid #2a65f1',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#4a5568',
    border: 'none',
  },
  danger: {
    backgroundColor: '#e53e3e',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(229, 62, 62, 0.25)',
  },
  success: {
    backgroundColor: '#38a169',
    color: '#ffffff',
    boxShadow: '0 2px 8px rgba(56, 161, 105, 0.25)',
  },
  small: {
    padding: '8px 16px',
    fontSize: '13px',
  },
  large: {
    padding: '16px 32px',
    fontSize: '17px',
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  fullWidth: {
    width: '100%',
  },
};

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  ...props
}) => {
  const computedStyle = {
    ...buttonStyles.base,
    ...buttonStyles[variant],
    ...(size === 'small' && buttonStyles.small),
    ...(size === 'large' && buttonStyles.large),
    ...(disabled && buttonStyles.disabled),
    ...(fullWidth && buttonStyles.fullWidth),
    ...style,
  };

  return (
    <button
      type={type}
      style={computedStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;