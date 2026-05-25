import type { UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  placeholder?: string;
}

const InputField = ({
  label,
  name,
  type = "text",
  register,
  placeholder,
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        step={type === "number" ? "any" : undefined}
        {...register(name, { required: true })}
        className=" p-2 border w-full rounded-md focus:outline-none focus:ring focus:border-blue-300"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
