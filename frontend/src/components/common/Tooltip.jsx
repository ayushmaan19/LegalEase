import React, { useState, useRef, useEffect } from 'react';

const tooltipStyles = {
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#1a202c',
    color: '#ffffff',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    zIndex: 1000,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.2s, visibility 0.2s',
    pointerEvents: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  visible: {
    opacity: 1,
    visibility: 'visible',
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },
  // Positions
  top: {
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginBottom: '8px',
  },
  bottom: {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '8px',
  },
  left: {
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginRight: '8px',
  },
  right: {
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: '8px',
  },
  // Arrow positions
  arrowTop: {
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '6px 6px 0 6px',
    borderColor: '#1a202c transparent transparent transparent',
  },
  arrowBottom: {
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '0 6px 6px 6px',
    borderColor: 'transparent transparent #1a202c transparent',
  },
  arrowLeft: {
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    borderWidth: '6px 0 6px 6px',
    borderColor: 'transparent transparent transparent #1a202c',
  },
  arrowRight: {
    right: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    borderWidth: '6px 6px 6px 0',
    borderColor: 'transparent #1a202c transparent transparent',
  },
};

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  style = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getPositionStyle = () => {
    switch (position) {
      case 'top': return tooltipStyles.top;
      case 'bottom': return tooltipStyles.bottom;
      case 'left': return tooltipStyles.left;
      case 'right': return tooltipStyles.right;
      default: return tooltipStyles.top;
    }
  };

  const getArrowStyle = () => {
    switch (position) {
      case 'top': return tooltipStyles.arrowTop;
      case 'bottom': return tooltipStyles.arrowBottom;
      case 'left': return tooltipStyles.arrowLeft;
      case 'right': return tooltipStyles.arrowRight;
      default: return tooltipStyles.arrowTop;
    }
  };

  const tooltipStyle = {
    ...tooltipStyles.tooltip,
    ...getPositionStyle(),
    ...(isVisible && tooltipStyles.visible),
    ...style,
  };

  const arrowStyle = {
    ...tooltipStyles.arrow,
    ...getArrowStyle(),
  };

  return (
    <div
      style={tooltipStyles.wrapper}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <div style={tooltipStyle}>
        {content}
        <span style={arrowStyle} />
      </div>
    </div>
  );
};

export default Tooltip;