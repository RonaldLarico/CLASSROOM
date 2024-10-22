import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PersonalInfoForm from "./PersonalInfoForm";
import FinancialInfoForm from "../financial-info/FinancialInfoForm";
import { formSchema } from "./formSchema";
import { z } from "zod";
import { useAuth } from "@/context/Authcontext";
import { useToast } from "@/hooks/use-toast";
import { addParticipant } from "@/actions/actions";

interface AddParticipantModalProps {
  graduateId: number;
  totalPrice: number;
}

function AddParticipantModal({
  graduateId,
  totalPrice,
}: AddParticipantModalProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [openPersonalModal, setOpenPersonalModal] = useState(false);
  const [openFinancialModal, setOpenFinancialModal] = useState(false); // Controls financial form dialog

  const [participantId, setParticipantId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      documentType: "dni",
      documentNumber: "",
      address: "",
      email: "",
      occupation: "",
      phone: "",
      birthDate: undefined,
      identDoc: undefined,
      signMatricula: undefined,
      studyDoc: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const formData = new FormData();
    if (values.identDoc) formData.append("dniImage", values.identDoc);
    if (values.signMatricula) formData.append("form", values.signMatricula);
    if (values.studyDoc) formData.append("imageTitle", values.studyDoc);

    formData.append("fullName", values.fullName);
    formData.append("password", "pollito123");
    formData.append("documentNumber", values.documentNumber);
    formData.append("occupation", values.occupation ?? "");
    if (values.email) formData.append("email", values.email);
    if (values.birthDate) {
      formData.append("birthDate", values.birthDate.toISOString());
    }
    if (values.address) formData.append("address", values.address);
    if (values.phone) formData.append("phone", values.phone);

    try {
      const participantData = await addParticipant(
        formData,
        token as string,
        graduateId
      );
      setParticipantId(participantData.id);
      form.reset();
      setOpenPersonalModal(false);

      toast({
        title: "Participante guardado",
        description: "Se ha guardado el participante exitosamente",
      });
      // Open financial form modal
      setOpenFinancialModal(true);
    } catch (error) {
      console.error("Error al guardar el participante:", error);
      toast({
        variant: "destructive",
        title: "Error al guardar el participante",
        description: "Ocurrio un error al guardar el participante: " + error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={openPersonalModal} onOpenChange={setOpenPersonalModal}>
        <DialogTrigger asChild>
          <Button
            className="w-full mt-2 md:mt-0 md:w-auto"
            onClick={() => setOpenPersonalModal(true)}
          >
            <CirclePlus className="mr-2" />
            Agregar participante
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90svh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Agregar participante</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <PersonalInfoForm form={form} />
              <DialogFooter>
                <Button
                  variant={"outline"}
                  type="button"
                  onClick={() => form.reset()}
                >
                  Limpiar datos
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar participante"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Financial Info Form Dialog */}
      {participantId && (
        <Dialog open={openFinancialModal} onOpenChange={setOpenFinancialModal}>
          <DialogContent className="max-h-[90svh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Información Financiera
              </DialogTitle>
              <DialogDescription>
                Añade el método de pago que utilizará el participante:
              </DialogDescription>
            </DialogHeader>
            <FinancialInfoForm
              studentGraduateId={participantId}
              totalPrice={totalPrice}
              onClose={() => setOpenFinancialModal(false)} // Close dialog after saving financial info
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AddParticipantModal;
