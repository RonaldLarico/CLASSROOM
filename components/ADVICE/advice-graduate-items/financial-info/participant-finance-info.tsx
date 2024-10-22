import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FinancialInfoForm from "./FinancialInfoForm";
import { StudentGraduate } from "@/lib/definitions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
interface ParticipantFinancialInfoProps {
  participant: StudentGraduate | null;
  totalPrice: number;
}

function ParticipantFinancialInfo({
  participant,
  totalPrice,
}: ParticipantFinancialInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex gap-4">
        <div className=" flex w-full items-center gap-1.5">
          {/* Show the rest of the quota array if needed */}
          {participant?.quota?.slice(0)?.map((quota) => (
            <div key={quota.id}>
              <Label>{quota.name}</Label>
              <Input readOnly value={quota.price} />
            </div>
          ))}
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {participant?.quota?.length === 0 && (
            <Button onClick={() => setIsOpen(true)}>
              Agregar información financiera
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-h-[90svh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Editar Información Financiera
            </DialogTitle>
            <DialogDescription>
              Añade el método de pago que utilizará el participante:
            </DialogDescription>
          </DialogHeader>
          <FinancialInfoForm
            totalPrice={totalPrice}
            studentGraduateId={participant?.id || null}
            onClose={handleClose} // Se cierra el modal después de guardar
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ParticipantFinancialInfo;
