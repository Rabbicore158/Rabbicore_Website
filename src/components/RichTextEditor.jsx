import React, { useRef, useState, useEffect } from "react";
import {
  FaBold, FaItalic, FaListUl, FaListOl, FaLink, FaHeading, FaEye,
} from "./Icons.jsx";

export default function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (ref.current && !initialized.current) {
      ref.current.innerHTML = value || "<p>Start writing...</p>";
      initialized.current = true;
    }
  }, [value]);

  const exec = (cmd, arg) => {
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    onChange(ref.current.innerHTML);
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  const buttons = [
    { icon: FaHeading, label: "Heading", action: () => exec("formatBlock", "H2") },
    { icon: FaBold, label: "Bold", action: () => exec("bold") },
    { icon: FaItalic, label: "Italic", action: () => exec("italic") },
    { icon: FaListUl, label: "Bullet list", action: () => exec("insertUnorderedList") },
    { icon: FaListOl, label: "Numbered list", action: () => exec("insertOrderedList") },
    { icon: FaLink, label: "Insert link", action: addLink },
  ];

  return (
    <div>
      <div className="rte-toolbar">
        {buttons.map((b, i) => (
          <button type="button" key={i} onClick={b.action} title={b.label} aria-label={b.label}><b.icon size={14} /></button>
        ))}
        <button type="button" onClick={() => setPreview((p) => !p)} title="Preview" aria-label="Toggle preview" className={preview ? "active" : ""} style={{ marginLeft: "auto" }}>
          <FaEye size={14} />
        </button>
      </div>
      {preview ? (
        <div className="rte-editor article-content" dangerouslySetInnerHTML={{ __html: ref.current?.innerHTML || value }} />
      ) : (
        <div
          ref={ref}
          className="rte-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
        />
      )}
    </div>
  );
}
