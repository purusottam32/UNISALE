"use client";

import { forwardRef, useId } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * Form controls.
 *
 * Kept as one module because every control shares the same `control` recipe
 * and the same `<Field>` wrapper — splitting them across six files would
 * duplicate the recipe or force a seventh file to hold it.
 *
 * ACCESSIBILITY CONTRACT, enforced here so no screen has to remember it:
 *   · label and control are joined by a generated id
 *   · errors get `aria-invalid` + `aria-describedby`, so the message is
 *     announced *with* the field rather than as loose text somewhere on screen
 *   · hint and error occupy the same slot — a field never shows both, because
 *     an error that appears below a hint reads as an additional instruction
 */

const control = cva(
  [
    "w-full bg-surface text-ink placeholder:text-muted",
    "rounded-sm shadow-e1",
    "outline-none transition-[box-shadow,background-color] duration-[--duration-fast] ease-[--ease-standard]",
    "focus:shadow-[inset_0_0_0_1px_var(--color-brand)] focus:ring-4 focus:ring-brand-ring",
    "disabled:bg-surface-2 disabled:text-muted disabled:cursor-not-allowed",
  ],
  {
    variants: {
      invalid: {
        true: "shadow-[inset_0_0_0_1px_var(--color-danger)] focus:shadow-[inset_0_0_0_1px_var(--color-danger)] focus:ring-danger-tint",
        false: "",
      },
      inputSize: {
        sm: "h-9 px-3 text-body-sm",
        md: "h-11 px-3.5 text-body-sm",
        lg: "h-[52px] px-4 text-body",
      },
    },
    defaultVariants: { invalid: false, inputSize: "md" },
  }
);

type ControlVariants = VariantProps<typeof control>;

/* ── Field wrapper ────────────────────────────────────────────────────────*/

export interface FieldProps {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  describedById?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  describedById,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="block text-body-sm font-medium text-ink-2">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          )}
        </label>
      )}

      {children}

      {error ? (
        <p id={describedById} role="alert" className="text-caption font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={describedById} className="text-caption text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/* ── Input ────────────────────────────────────────────────────────────────*/

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    ControlVariants {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  /** Static adornment — a ₹ symbol, a search glyph. Never interactive. */
  leading?: React.ReactNode;
  /** May be interactive (a show/hide toggle), so it keeps pointer events. */
  trailing?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, required, inputSize, leading, trailing, className, id, ...props },
  ref
) {
  const generated = useId();
  const inputId = id || generated;
  const describedBy = `${inputId}-desc`;

  const field = (
    <input
      ref={ref}
      id={inputId}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={error || hint ? describedBy : undefined}
      className={cn(
        control({ invalid: Boolean(error), inputSize }),
        leading && "pl-10",
        trailing && "pr-11",
        className
      )}
      {...props}
    />
  );

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={inputId}
      describedById={describedBy}
    >
      {leading || trailing ? (
        <div className="relative">
          {leading && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              {leading}
            </span>
          )}
          {field}
          {trailing && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">{trailing}</span>
          )}
        </div>
      ) : (
        field
      )}
    </Field>
  );
});

/* ── Textarea ─────────────────────────────────────────────────────────────*/

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, required, maxLength, value, className, id, ...props },
  ref
) {
  const generated = useId();
  const textareaId = id || generated;
  const describedBy = `${textareaId}-desc`;
  const used = typeof value === "string" ? value.length : undefined;
  const nearLimit = maxLength !== undefined && used !== undefined && used > maxLength * 0.9;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={textareaId}
      describedById={describedBy}
    >
      <div className="relative">
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? describedBy : undefined}
          className={cn(
            control({ invalid: Boolean(error) }),
            "min-h-28 resize-y px-3.5 py-3 text-body-sm leading-relaxed",
            "h-auto",
            maxLength !== undefined && "pb-8",
            className
          )}
          {...props}
        />

        {maxLength !== undefined && used !== undefined && (
          /* Counter only turns amber in the last 10% — a permanently coloured
             counter reads as an error the whole time you are typing. */
          <span
            aria-live="polite"
            className={cn(
              "pointer-events-none absolute bottom-2.5 right-3.5 text-caption tabular",
              nearLimit ? "text-warn" : "text-muted"
            )}
          >
            {used}/{maxLength}
          </span>
        )}
      </div>
    </Field>
  );
});

/* ── Select ───────────────────────────────────────────────────────────────*/

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    ControlVariants {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  options: (SelectOption | string)[];
  placeholder?: string;
}

/**
 * Native `<select>` on purpose. Mobile browsers render it as an OS wheel or
 * sheet, which is faster to operate one-handed than any custom listbox — and
 * this is a marketplace used mostly on phones.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, required, inputSize, options, placeholder, className, id, ...props },
  ref
) {
  const generated = useId();
  const selectId = id || generated;
  const describedBy = `${selectId}-desc`;

  return (
    <Field
      label={label}
      hint={hint}
      error={error}
      required={required}
      htmlFor={selectId}
      describedById={describedBy}
    >
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? describedBy : undefined}
          className={cn(
            control({ invalid: Boolean(error), inputSize }),
            "cursor-pointer appearance-none pr-10",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => {
            const value = typeof option === "string" ? option : option.value;
            const text = typeof option === "string" ? option : option.label;
            return (
              <option key={String(value)} value={value}>
                {text}
              </option>
            );
          })}
        </select>

        <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
          <ChevronDown size={iconSize.sm} strokeWidth={ICON_STROKE} />
        </span>
      </div>
    </Field>
  );
});

/* ── Switch ───────────────────────────────────────────────────────────────*/

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  id?: string;
}

/**
 * A setting that applies immediately. Radix gives us the `role="switch"` +
 * keyboard contract; the visual is ours.
 */
export function Toggle({ checked, onChange, label, description, disabled, id }: ToggleProps) {
  const generated = useId();
  const toggleId = id || generated;
  const descId = `${toggleId}-desc`;

  return (
    <div className="flex items-start justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <label htmlFor={toggleId} className="block cursor-pointer text-body-sm font-medium text-ink">
          {label}
        </label>
        {description && (
          <p id={descId} className="mt-0.5 text-caption text-muted">
            {description}
          </p>
        )}
      </div>

      <SwitchPrimitive.Root
        id={toggleId}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-describedby={description ? descId : undefined}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full",
          "transition-colors duration-[--duration-fast] ease-[--ease-standard]",
          "data-[state=checked]:bg-brand data-[state=unchecked]:bg-surface-3",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "block h-5 w-5 rounded-full bg-white shadow-e1",
            "transition-transform duration-[--duration-fast] ease-[--ease-out]",
            "translate-x-0.5 data-[state=checked]:translate-x-[22px]"
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}

/* ── Checkbox ─────────────────────────────────────────────────────────────*/

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function Checkbox({ checked, onChange, label, disabled, id, className }: CheckboxProps) {
  const generated = useId();
  const boxId = id || generated;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <CheckboxPrimitive.Root
        id={boxId}
        checked={checked}
        onCheckedChange={(next) => onChange(next === true)}
        disabled={disabled}
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-xs",
          "shadow-[inset_0_0_0_1px_var(--color-line-strong)]",
          "transition-colors duration-[--duration-fast]",
          "data-[state=checked]:bg-brand data-[state=checked]:shadow-none",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <CheckboxPrimitive.Indicator className="text-brand-fg">
          <Check size={13} strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && (
        <label htmlFor={boxId} className="cursor-pointer text-body-sm text-ink-2">
          {label}
        </label>
      )}
    </div>
  );
}

/* ── ChoiceGroup ──────────────────────────────────────────────────────────*/

export interface Choice {
  value: string;
  label: string;
  hint?: string;
}

/**
 * Card-style radio group.
 *
 * Used where a native select would hide the options — item condition, listing
 * type. The `hint` line matters: "Good — light wear, works perfectly" prevents
 * far more handover disputes than the word "Good" alone.
 */
export function ChoiceGroup({
  label,
  hint,
  error,
  options,
  value,
  onChange,
  columns = 1,
  name,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  options: Choice[];
  value?: string;
  onChange: (value: string) => void;
  columns?: 1 | 2;
  name?: string;
}) {
  return (
    <Field label={label} hint={hint} error={error}>
      <div
        role="radiogroup"
        aria-label={typeof label === "string" ? label : undefined}
        className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "grid-cols-1")}
      >
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              name={name}
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-sm px-3.5 py-3 text-left",
                "transition-[background-color,box-shadow] duration-[--duration-fast] ease-[--ease-standard]",
                "active:scale-[0.99]",
                selected
                  ? "bg-brand-tint shadow-[inset_0_0_0_1px_var(--color-brand)]"
                  : "bg-surface shadow-e1 hover:bg-surface-2"
              )}
            >
              <span
                className={cn(
                  "block text-body-sm font-semibold",
                  selected ? "text-brand" : "text-ink"
                )}
              >
                {option.label}
              </span>
              {option.hint && (
                <span className="mt-0.5 block text-caption text-muted">{option.hint}</span>
              )}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export { control as controlVariants };
