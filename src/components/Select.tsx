import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import "../select.css";

type Option<T extends string> = { value: T; label: string };

/** A select-only combobox shared by filters, sorting and the studio camera. */
export default function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const selected = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [active, setActive] = useState(selected);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 320,
  });
  const search = useRef({ text: "", time: 0 });

  useLayoutEffect(() => {
    if (!open || !trigger.current) return;
    const place = () => {
      const rect = trigger.current!.getBoundingClientRect();
      const below = window.innerHeight - rect.bottom - 16;
      const above = rect.top - 16;
      const desired = Math.min(336, options.length * 48 + 16);
      const flip = below < desired && above > below;
      const maxHeight = Math.max(80, Math.min(desired, flip ? above : below));
      setPosition({
        left: Math.max(
          12,
          Math.min(rect.left, window.innerWidth - rect.width - 12),
        ),
        top: flip ? rect.top - maxHeight - 8 : rect.bottom + 8,
        width: Math.min(rect.width, window.innerWidth - 24),
        maxHeight,
      });
    };
    place();
    window.addEventListener("resize", place);
    const scroll = (event: Event) => {
      if (!menu.current?.contains(event.target as Node)) place();
    };
    window.addEventListener("scroll", scroll, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", scroll, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!trigger.current?.contains(target) && !menu.current?.contains(target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (!open || !menu.current) return;
    const option = menu.current.querySelector<HTMLElement>(
      `[data-index="${active}"]`,
    );
    if (!option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < menu.current.scrollTop) menu.current.scrollTop = top;
    else if (bottom > menu.current.scrollTop + menu.current.clientHeight) {
      menu.current.scrollTop = bottom - menu.current.clientHeight;
    }
  }, [active, open]);

  function choose(index: number) {
    onChange(options[index].value);
    setOpen(false);
    trigger.current?.focus({ preventScroll: true });
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event;
    if (key === "Escape" || key === "Tab") {
      if (open && key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
      }
      setOpen(false);
      return;
    }
    if (
      key === "ArrowDown" ||
      key === "ArrowUp" ||
      key === "Home" ||
      key === "End"
    ) {
      event.preventDefault();
      setActive(
        key === "Home"
          ? 0
          : key === "End"
            ? options.length - 1
            : !open
              ? selected
              : (active + (key === "ArrowDown" ? 1 : -1) + options.length) %
                options.length,
      );
      setOpen(true);
    } else if (key === "Enter" || key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else {
        setActive(selected);
        setOpen(true);
      }
    } else if (
      key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey
    ) {
      const now = Date.now();
      search.current = {
        text: now - search.current.time < 650 ? search.current.text + key : key,
        time: now,
      };
      const index = options.findIndex((option) =>
        option.label
          .toLocaleLowerCase()
          .startsWith(search.current.text.toLocaleLowerCase()),
      );
      if (index >= 0) {
        event.preventDefault();
        setActive(index);
        setOpen(true);
      }
    }
  }

  return (
    <div className={`select-control ${className}`}>
      <button
        ref={trigger}
        type="button"
        className={`select-trigger ${open ? "is-open" : ""}`}
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          if (!menu.current?.contains(event.relatedTarget)) setOpen(false);
        }}
        onClick={() => {
          setActive(selected);
          setOpen(!open);
        }}
      >
        <span>{options[selected]?.label}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </button>
      {open &&
        createPortal(
          <div
            id={`${id}-list`}
            ref={menu}
            className="select-menu"
            role="listbox"
            aria-label={label}
            style={position}
          >
            {options.map((option, index) => (
              <div
                id={`${id}-${index}`}
                key={option.value}
                data-index={index}
                role="option"
                aria-selected={value === option.value}
                className={`select-option ${active === index ? "is-highlighted" : ""}`}
                onPointerDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {value === option.value && (
                  <Check size={17} aria-hidden="true" />
                )}
              </div>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
