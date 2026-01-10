import React from 'react';

const cardStyles = {
  base: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '24px',
    transition: 'all 0.2s ease',
  },
  elevated: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  hoverable: {
    cursor: 'pointer',
  },
  compact: {
    padding: '16px',
  },
  spacious: {
    padding: '32px',
  },
};

const Card = ({
  children,
  elevated = false,
  hoverable = false,
  padding = 'default',
  style = {},
  onClick,
  ...props
}) => {
  const computedStyle = {
    ...cardStyles.base,
    ...(elevated && cardStyles.elevated),
    ...(hoverable && cardStyles.hoverable),
    ...(padding === 'compact' && cardStyles.compact),
    ...(padding === 'spacious' && cardStyles.spacious),
    ...style,
  };

  const handleMouseEnter = (e) => {
    if (hoverable) {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.08)';
    }
  };

  const handleMouseLeave = (e) => {
    if (hoverable) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = elevated ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none';
    }
  };

  return (
    <div
      style={computedStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, style = {} }) => (
  <div style={{
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e2e8f0',
    ...style
  }}>
    {children}
  </div>
);

export const CardTitle = ({ children, style = {} }) => (
  <h3 style={{
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a202c',
    ...style
  }}>
    {children}
  </h3>
);

export const CardDescription = ({ children, style = {} }) => (
  <p style={{
    margin: '4px 0 0',
    fontSize: '14px',
    color: '#718096',
    ...style
  }}>
    {children}
  </p>
);

export const CardContent = ({ children, style = {} }) => (
  <div style={{ ...style }}>
    {children}
  </div>
);

export const CardFooter = ({ children, style = {} }) => (
  <div style={{
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    ...style
  }}>
    {children}
  </div>
);

export default Card;