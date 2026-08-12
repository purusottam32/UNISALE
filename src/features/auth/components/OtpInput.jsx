"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const LENGTH = 6;

/**
 * Six-box OTP field.
 *
 * The details that decide whether this step feels effortless: digits advance
 * the caret automatically, Backspace on an empty box steps back, pasting the
 * whole code from the email fills every box at once, and the inputs declare
 * `one-time-code` so iOS and Android offer the SMS/email autofill chip.
 */
export default function OtpInput({ value = "", onChange, onComplete, disabled, error }) {
  const refs = useRef([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const commit = (next) => {
    onChange(next);
    if (next.length === LENGTH) onComplete?.(next);
  };

  const setDigit = (index, digit) => {
    const chars = value.padEnd(LENGTH, " ").split("");
    chars[index] = digit || " ";
    commit(chars.join("").trimEnd().replace(/\s/g, ""));
  };

  const handleChange = (index, raw) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    setDigit(index, digit);
    if (index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (value[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    }
    if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!digits) return;
    commit(digits);
    refs.current[Math.min(digits.length, LENGTH - 1)]?.focus();
  };

  return (
    <div>
      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {Array.from({ length: LENGTH }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            disabled={disabled}
            value={value[index] || ""}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => event.target.select()}
            aria-label={`Digit ${index + 1} of ${LENGTH}`}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-14 w-full rounded-md border-2 bg-surface text-center text-xl font-bold text-ink",
              "outline-none transition-colors duration-150",
              "focus:border-brand focus:ring-4 focus:ring-brand-ring",
              "disabled:opacity-60",
              error ? "border-danger" : value[index] ? "border-brand" : "border-line"
            )}
          />
        ))}
      </div>
      {error && <p className="mt-2 text-center text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
