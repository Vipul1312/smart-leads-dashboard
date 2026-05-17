import type { SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
}

const Select = ({ label, options, ...rest }: SelectProps) => (
  <div className="mb-4">
    {label && <label className="block text-sm mb-1 font-medium">{label}</label>}
    <select
      {...rest}
      className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
