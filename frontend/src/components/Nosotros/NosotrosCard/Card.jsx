import { forwardRef, useRef, useEffect } from "react";
import "./Card.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const Card = forwardRef(function Card({ data, index, onAction }, ref) {
  const contentRef = useRef(null);
  const overlayRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.__contentRef = contentRef.current;
    el.__overlayRef = overlayRef.current;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  }, [ref]);

  return (
    <div
      ref={rootRef}
      className="stack-card"
      data-index={index}
      style={{
        top: `${index * 24}px`,
        zIndex: index + 1,
      }}
    >
      <img
        src={data.image}
        alt={data.title}
        className="card-image"
      />

      <div ref={overlayRef} className="card-overlay" />

      <div ref={contentRef} className="card-content">
        
        <div className="card-item card-header">
          <div className="card-icon">
            <FontAwesomeIcon icon={data.iconLabel} />
          </div>
          <span className="card-subtitle">
            {data.subtitle}
          </span>
        </div>

        <h2 className="card-item card-title">
          {data.title}
        </h2>

        <p className="card-item card-description">
          {data.description}
        </p>

        <div className="card-item card-tags">
          {data.tags.map((tag) => (
            <span key={tag} className="card-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="card-item card-button-wrapper">
          <button
            className="card-button"
            onClick={onAction}
            style={{ background: data.accentColor || "#3045FF" }}
          >
            {data.cta}
            <FontAwesomeIcon icon={faCircleCheck} className="card-button-icon" />
          </button>
        </div>

      </div>
    </div>
  );
});

export default Card;