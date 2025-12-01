import { useState, useEffect, useRef } from 'react';

export const useDetectOutsideClick = (initialState) => {
  const triggerRef = useRef(null); // The element that triggers the dropdown
  const nodeRef = useRef(null); // The dropdown menu itself
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is on the trigger, toggle the dropdown
      if (triggerRef.current && triggerRef.current.contains(event.target)) {
        return setIsActive(!isActive);
      }
      
      // If the click is outside both the trigger and the dropdown, close it
      if (nodeRef.current && !nodeRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive]);

  return { triggerRef, nodeRef, isActive, setIsActive };
};