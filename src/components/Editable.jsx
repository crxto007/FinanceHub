import { useState, useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';

export function Editable({ value, onChange, type = 'text', className = '', prefix = '', suffix = '' }) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleBlur = () => {
    setEditing(false);
    if (type === 'number') {
      const num = parseFloat(inputValue) || 0;
      onChange(num);
    } else {
      onChange(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setInputValue(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <span className={`inline-flex items-center ${className}`}>
        {prefix && <span className="mr-1">{prefix}</span>}
        <input
          ref={inputRef}
          type={type === 'number' ? 'number' : 'text'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="editing px-1 py-0 w-full min-w-[60px] text-inherit"
        />
        {suffix && <span className="ml-1">{suffix}</span>}
      </span>
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`editable inline-flex items-center cursor-pointer rounded px-1 -mx-1 ${className}`}
    >
      {prefix && <span className="mr-1">{prefix}</span>}
      {inputValue}
      {suffix && <span className="ml-1">{suffix}</span>}
      <Pencil size={12} className="ml-1 opacity-0 group-hover:opacity-100" />
    </span>
  );
}

export function EditableText({ value, onChange, className = '' }) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setInputValue(value); }, [value]);
  useEffect(() => { if (editing && inputRef.current) { inputRef.current.focus(); inputRef.current.select(); } }, [editing]);

  const handleBlur = () => {
    setEditing(false);
    onChange(inputValue);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') handleBlur(); }}
        className="editing px-2 py-1 w-full"
        autoFocus
      />
    );
  }

  return (
    <span onClick={() => setEditing(true)} className={`editable cursor-pointer rounded px-1 -mx-1 ${className}`}>
      {value}
    </span>
  );
}

export function EditableSelect({ value, onChange, options, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent border border-blue-500 rounded px-2 py-1 ${className}`}
    >
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );
}