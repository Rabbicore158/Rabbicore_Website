import React from "react";

function slugifyHeading(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderInline(text, key) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export function ArticleContent({ content }) {
  const lines = content.split("\n");
  const blocks = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push({ type: "ul", items: [...listBuffer] });
      listBuffer = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
    } else if (trimmed.startsWith("- ")) {
      listBuffer.push(trimmed.slice(2));
    } else {
      flushList();
      blocks.push({ type: "p", text: trimmed });
    }
  });
  flushList();

  return (
    <div className="article-content">
      {blocks.map((b, i) => {
        if (b.type === "h2") {
          return <h2 key={i} id={slugifyHeading(b.text)}>{b.text}</h2>;
        }
        if (b.type === "ul") {
          return (
            <ul key={i} style={{ margin: "0 0 16px 20px" }}>
              {b.items.map((it, j) => (
                <li key={j} style={{ color: "var(--ink-soft)", padding: "5px 0", listStyle: "disc" }}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(b.text)}</p>;
      })}
    </div>
  );
}

export { slugifyHeading };
