"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { imageSchema } from "@/lib/image-schema";
import { createInstitute } from "@/actions/create-edit-Corp-Institute";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { Corporation } from "@/lib/definitions";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campo requerido.",
  }),
  description: z.string().min(2, { message: "Campo requerido." }),
  observation: z.string().optional(),
  corporationIds: z
    .array(z.string())
    .nonempty({ message: "Al menos un ID de institución es requerido." }),
  image: imageSchema,
});

interface CreateInstituteProps {
  corporations: Corporation[];
}

export default function CreateInstitute({
  corporations = [],
}: CreateInstituteProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      observation: "",
      corporationIds: [],
      image: null,
    },
  });

  const [selectedCorporations, setSelectedCorporations] = useState<string[]>(
    []
  );

  async function CreateInstitute(data: any) {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("observation", data.observation);
    data.corporationIds.forEach((id: string) => formData.append("corporationIds[]", id));
    console.log(data.corporationIds);
    if (data.image) formData.append("image", data.image);
    try {
       await createInstitute(formData); 
      toast({
        title: "Institución creada",
        description: "Institución creada correctamente.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la institución.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Crear institución</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear institución</DialogTitle>
          <DialogDescription>
            Ingresa los datos de la nueva institución y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(CreateInstitute)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la institución" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Observaciones
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Observación" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="corporationIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Elige las corporaciones con las que tendrá relación{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={corporations.map((corp) => ({
                        value: corp.id.toString(),
                        label: corp.name,
                      }))}
                      value={selectedCorporations}
                      onValueChange={(value) => {
                        setSelectedCorporations(value);
                        field.onChange(value);
                      }}
                      defaultValue={selectedCorporations}
                      placeholder="Corporaciones"
                      variant="inverted"
                      animation={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Logo de la institución{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-2">
              <Button disabled={loading} type="submit">
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
