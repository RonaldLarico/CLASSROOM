import React, { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PersonalInfoForm from "../addParticipantGraduate/PersonalInfoForm";
import FinancialInfoForm from "../financial-info.tsx/FinancialInfoForm";
import { formSchema } from "../addParticipantGraduate/formSchema";
import { z } from "zod";
import axios from "axios";
import { useAuth } from "@/context/Authcontext";
import { AxiosError } from "axios";
type FormValues = z.infer<typeof formSchema>;

interface EditParticipantModalProps {
  graduateId: number;
  participantId: number;
  participantData: FormValues;
}

const EditParticipantModal: React.FC<EditParticipantModalProps> = ({
    graduateId,
    participantId,
    participantData,
  }) => {
    const { token } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<FormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: participantData,
    });
  
    useEffect(() => {
      form.reset(participantData);
    }, [participantData, form]);
  
    const onSubmit = async (values: FormValues) => {
      console.log("Form submitted with values:", values);
      const formData = new FormData();
  
      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof FormValues;
        const value = values[typedKey];
        const originalValue = participantData[typedKey];
  
        if (value !== originalValue) {
          if (
            typedKey === "identDoc" ||
            typedKey === "signMatricula" ||
            typedKey === "studyDoc"
          ) {
            if (value instanceof File) {
              formData.append(key, value);
            }
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });
  
      try {
        console.log(
          "Sending PATCH request with formData:",
          Object.fromEntries(formData)
        );
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/studentGraduate/${participantId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Success:", response.data.message);
  
        // Add user feedback here (e.g., toast notification)
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error updating participant:", error);
          console.log("Error details:", error.response?.data || error.message);
        } else {
          console.error("Unknown error:", error);
        }
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90svh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar participante</DialogTitle>
            <DialogDescription>
              Diplomado: {/* Add diploma name if available */}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                console.log("Formulario enviado");
                onSubmit(values); // Asegúrate de que la función onSubmit se llame aquí.
              })}
              className="space-y-2"
            >
              <PersonalInfoForm form={form as UseFormReturn<FormValues>} />
              <FinancialInfoForm form={form as UseFormReturn<FormValues>} />
              <DialogFooter>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default EditParticipantModal;