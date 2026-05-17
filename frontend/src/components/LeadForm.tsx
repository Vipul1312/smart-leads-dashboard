import { useForm } from "react-hook-form";
import type { LeadFormData, Lead } from "../types";
import Input from "./Input";
import Select from "./Select";
import Button from "./Button";

interface Props {
  initial?: Lead;
  onSubmit: (data: LeadFormData) => void;
  loading?: boolean;
}

const LeadForm = ({ initial, onSubmit, loading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: {
      name: initial?.name || "",
      email: initial?.email || "",
      status: initial?.status || "New",
      source: initial?.source || "Website",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <Input
        label="Name"
        {...register("name", { required: "Name is required" })}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
        })}
        error={errors.email?.message}
      />
      <Select
        label="Status"
        {...register("status")}
        options={[
          { value: "New", label: "New" },
          { value: "Contacted", label: "Contacted" },
          { value: "Qualified", label: "Qualified" },
          { value: "Lost", label: "Lost" },
        ]}
      />
      <Select
        label="Source"
        {...register("source")}
        options={[
          { value: "Website", label: "Website" },
          { value: "Instagram", label: "Instagram" },
          { value: "Referral", label: "Referral" },
        ]}
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Lead"}
      </Button>
    </form>
  );
};

export default LeadForm;
