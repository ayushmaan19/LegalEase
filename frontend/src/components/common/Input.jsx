import React, { forwardRef } from 'react';

const inputStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#4a5568',
  },
  required: {
    color: '#e53e3e',
    marginLeft: '2px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#2d3748',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#2a65f1',
    boxShadow: '0 0 0 3px rgba(42, 101, 241, 0.15)',
  },
  inputError: {
    borderColor: '#e53e3e',
    boxShadow: '0 0 0 3px rgba(229, 62, 62, 0.15)',
  },
  inputDisabled: {
    backgroundColor: '#f7fafc',
    color: '#a0aec0',
    cursor: 'not-allowed',
  },
  iconLeft: {
    position: 'absolute',
    left: '12px',
    color: '#718096',
    display: 'flex',
    alignItems: 'center',
  },
  iconRight: {
    position: 'absolute',
    right: '12px',
    color: '#718096',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  helperText: {
    fontSize: '13px',
    color: '#718096',
    margin: 0,
  },
  errorText: {
    fontSize: '13px',
    color: '#e53e3e',
    margin: 0,
  },
};

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  iconLeft,
  iconRight,
  onIconRightClick,
  style = {},
  inputStyle = {},
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const computedInputStyle = {
    ...inputStyles.input,
    ...(isFocused && !error && inputStyles.inputFocus),
    ...(error && inputStyles.inputError),
    ...(disabled && inputStyles.inputDisabled),
    ...(iconLeft && { paddingLeft: '40px' }),
    ...(iconRight && { paddingRight: '40px' }),
    ...inputStyle,
  };

  return (
    <div style={{ ...inputStyles.wrapper, ...style }}>
      {label && (
        <label style={inputStyles.label}>
          {label}
          {required && <span style={inputStyles.required}>*</span>}
        </label>
      )}
      <div style={inputStyles.inputWrapper}>
        {iconLeft && <span style={inputStyles.iconLeft}>{iconLeft}</span>}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={computedInputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {iconRight && (
          <span 
            style={inputStyles.iconRight} 
            onClick={onIconRightClick}
          >
            {iconRight}
          </span>
        )}
      </div>
      {error && <p style={inputStyles.errorText}>{error}</p>}
      {helperText && !error && <p style={inputStyles.helperText}>{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;