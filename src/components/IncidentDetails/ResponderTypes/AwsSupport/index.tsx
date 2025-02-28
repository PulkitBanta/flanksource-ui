import clsx from "clsx";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue
} from "react-hook-form";
import { TextInput } from "../../../TextInput";
import { AddResponderFormValues } from "../../AddResponder";

type AwsSupportProps = {
  control: Control;
  errors: FieldErrors;
  setValue: UseFormSetValue<AddResponderFormValues>;
} & React.HTMLProps<HTMLDivElement>;

export const AwsSupport = ({
  control,
  errors,
  className,
  ...rest
}: AwsSupportProps) => {
  return (
    <div className={clsx(className)} {...rest}>
      <div className="mb-4">
        <Controller
          control={control}
          name="category"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Category"
                id="category"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.category?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="description"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Description"
                id="description"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.description?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="body"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Body"
                id="body"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.body?.message}</p>
      </div>
    </div>
  );
};
