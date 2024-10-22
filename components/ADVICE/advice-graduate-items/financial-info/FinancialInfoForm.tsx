import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/Authcontext";
import { DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { createStudentQuotesAction } from "@/actions/createStudnGradQuote";
import { useToast } from "@/hooks/use-toast";
// Step 1: Define the form schema with Zod
const formSchema = z.object({
  paymentMethod: z
    .string()
    .min(1, { message: "Por favor, selecciona un método de pago." }),
  totalPrice: z.number().min(0, { message: "Invalid total price." }),
});

type FinancialInfoFormProps = {
  studentGraduateId: number | null;
  totalPrice: number;
  onClose: () => void; // Add an onClose function prop to handle dialog closing
};

function FinancialInfoForm({
  studentGraduateId,
  totalPrice,
  onClose, // Accept the onClose function prop
}: FinancialInfoFormProps) {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [quotasPrices, setQuotasPrices] = useState<number[]>([]);
  const [discountAmount, setdiscountAmount] = useState(0);
  const [installments, setInstallments] = useState(1);
  const { toast } = useToast();
  const { token } = useAuth();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "",
      totalPrice: totalPrice,
    },
  });

  const { handleSubmit, control, setValue } = form;

  useEffect(() => {
    setValue("totalPrice", Number(totalPrice));
  }, [totalPrice, setValue]);

  const calculateQuotes = (method: string) => {
    let newdiscountAmount = 0;
    let newInstallments = 1;

    switch (method) {
      case "Preventa":
        newdiscountAmount = 150;
        newInstallments = 1;
        break;
      case "En cuotas":
        newdiscountAmount = 0;
        newInstallments = 5;
        break;
      case "Contado":
        newdiscountAmount = 100;
        newInstallments = 1;
        break;
      case "Contado en 2 partes":
        newdiscountAmount = 100;
        newInstallments = 2;
        break;
      case "Contado en 3 partes":
        newdiscountAmount = 100;
        newInstallments = 3;
        break;
      case "Media beca":
        newdiscountAmount = totalPrice * 0.5;
        newInstallments = 5;
        break;
      case "Beca completa":
        setQuotasPrices([]);
        setdiscountAmount(totalPrice);
        setInstallments(1);
        return;
      case "Diplomado E-learning":
        newdiscountAmount = 30;
        newInstallments = 1;
        break;
      default:
        return;
    }

    const finalCost = totalPrice - newdiscountAmount;
    const perInstallment = finalCost / newInstallments;

    setdiscountAmount(newdiscountAmount);
    setInstallments(newInstallments);
    setQuotasPrices(Array(newInstallments).fill(perInstallment));
  };

  const handlePaymentMethodSelect = (method: string) => {
    setError("");
    setSelectedMethod(method);
    calculateQuotes(method);
    setValue("paymentMethod", method);
  };

  const onSubmit = async (formData: FormData) => {
    console.log("Form Data:", formData);
    console.log(
      "quantity:",
      installments,
      "discountAmount:",
      discountAmount,
      "StudentGraduateId:",
      studentGraduateId
    );
    formData.append("quantity", String(installments));
    formData.append("discountAmount", String(discountAmount));
    formData.append("studentGraduateId", String(studentGraduateId));
    formData.append("token", token as string);
    try {
      await createStudentQuotesAction(formData);
      console.log("Cuota creada");
      toast({
        title: "Cuotas creadas con éxito",
        description: "Las cuotas se han creado correctamente.",
      });
      onClose();
    } catch (error) {
      console.error("Error creating quota:", error);
      toast({
        variant: "destructive",
        title: "Error al crear cuotas",
        description: "Hubo un error al crear las cuotas.",
      });
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <Form {...form}>
      <form action={onSubmit} className="space-y-2">
        <div className="border p-2 rounded-sm">
          <h2 className="font-semibold mb-2">Información Financiera</h2>
          <div className="flex flex-wrap gap-4">
            <FormField
              control={control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem className="w-1/6">
                  <FormLabel>Costo diplomado</FormLabel>
                  <FormControl>
                    <Input readOnly {...field} value={field.value.toString()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="self-end">
                  Elige el método de pago
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => handlePaymentMethodSelect("Preventa")}
                  >
                    Preventa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handlePaymentMethodSelect("En cuotas")}
                  >
                    En cuotas
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Al contado</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onSelect={() => handlePaymentMethodSelect("Contado")}
                        >
                          Contado
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Contado en 2 partes")
                          }
                        >
                          Contado en 2 partes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Contado en 3 partes")
                          }
                        >
                          Contado en 3 partes
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Becas</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Media beca")
                          }
                        >
                          Media beca
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Beca completa")
                          }
                        >
                          Beca completa
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    onSelect={() =>
                      handlePaymentMethodSelect("Diplomado E-learning")
                    }
                  >
                    Diplomado E-learning
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedMethod && (
            <div className="mt-4 space-y-4">
              <h2 className="font-semibold">{selectedMethod.toUpperCase()}</h2>
              {quotasPrices.length > 0 && (
                <div className="space-y-2">
                  <FormLabel>Precios de cuotas</FormLabel>
                  <div className="flex space-x-2">
                    {quotasPrices.map((price, index) => (
                      <FormItem key={index} className="w-1/5">
                        <FormControl>
                          <Input value={price.toFixed(2)} readOnly />
                        </FormControl>
                      </FormItem>
                    ))}
                  </div>
                </div>
              )}
              {selectedMethod === "Beca completa" && (
                <p>La beca completa cubre todo el costo del diplomado.</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!selectedMethod}>
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default FinancialInfoForm;
