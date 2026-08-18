import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (isActive && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [isActive, children]);

  const toggleAccordion = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`accordion-item ${isActive ? 'active' : ''}`}>
      <button className="accordion-header" onClick={toggleAccordion}>
        <span className="accordion-title">{title}</span>
        <ChevronDown size={20} className="accordion-icon" />
      </button>
      <div 
        className="accordion-content" 
        style={{ maxHeight }}
      >
        <div ref={contentRef} className="accordion-content-inner">
          {children}
        </div>
      </div>
    </div>
  );
};
