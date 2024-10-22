import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues } from "react-hook-form";

interface ModuleFormValues {
  name: string;
  code: string;
  topics: string[];
  hours: string;
  totalPrice: number;
  state: boolean;
  checkImage: boolean;
  session: never[];
  numArrays: number;
  corporationIds: string;
  amountIds: string;
}

interface ChildFormProps {
  control: Control<ModuleFormValues>;
}

const ChildrenFormModule = ({ control }: ChildFormProps) => {
  return (
    <div className="flex justify-center gap-10">
      <FormField
        control={control}
        name="numArrays"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Cronogramas</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Ingresa un número"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : Number(value));
                }}
                value={
                  field.value === undefined || field.value === null
                    ? ""
                    : field.value
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="corporationIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Corporaciones</FormLabel>
            <FormControl>
              <Input
                placeholder="Seleccione las corporaciones"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                }}
                onBlur={() => {
                  if (typeof field.value === "string") {
                    const values = field.value
                      .split(",")
                      .map((val: string) => val.trim())
                      .filter((val: string) => val !== "")
                      .map((val: string) => Number(val))
                      .filter((val: number) => !isNaN(val));

                    field.onChange(values);
                  }
                }}
                value={
                  Array.isArray(field.value)
                    ? field.value.join(", ")
                    : field.value || ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="amountIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad por Corporación</FormLabel>
            <FormControl>
              <Input
                placeholder="Ingrese las cantidades, separadas por comas"
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                }}
                onBlur={() => {
                  if (typeof field.value === "string") {
                    const values = field.value
                      .split(",")
                      .map((val: string) => val.trim())
                      .filter((val: string) => val !== "")
                      .map((val: string) => Number(val))
                      .filter((val: number) => !isNaN(val));

                    field.onChange(values);
                  }
                }}
                value={
                  Array.isArray(field.value)
                    ? field.value.join(", ")
                    : field.value || ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ChildrenFormModule;
