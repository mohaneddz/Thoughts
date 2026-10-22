'use client';

export function TextQuestion({
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  value?: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  if (multiline) {
    return (
      <textarea
        className='h-32 w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 text-sm'
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <input
      className='h-11 w-full rounded-xl border border-[var(--color-border)] bg-transparent px-3 text-sm'
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}
