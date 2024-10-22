"use client";
import React, { useState } from "react";
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
import { editInstitute } from "@/actions/create-edit-Corp-Institute";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Institute,
  Corporation,
  CorporationOnInstitute,
} from "@/lib/definitions";

const formSchema = z.object({
  name: z.string().min(2, { message: "Campo requerido." }),
  description: z.string().min(2, { message: "Campo requerido." }),
  observation: z.string().optional(),
  corporationIds: z
    .array(z.string())
    .nonempty({ message: "Elige al menos una corporación." }),
  image: z.any().nullable(), // Handle image as nullable
});

interface EditInstituteProps {
  institute: Institute;
  corporations: Corporation[];
}

export default function EditInstitute({
  institute,
  corporations = [],
}: EditInstituteProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: institute?.name || "",
      description: institute?.description || "",
      observation: institute?.observation || "",
      corporationIds: institute.corporation.map((corporation) =>
        String(corporation.corporationId)
      ),
      image: institute.image || null,
    },
  });

  const [selectedCorporations, setSelectedCorporations] = useState<string[]>(
    form.getValues("corporationIds")
  );

  async function handleEditInstitute(data: any) {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("observation", data.observation);
    data.corporationIds.forEach((id: string) =>
      formData.append("corporationIds[]", id)
    );
    if (data.image) formData.append("image", data.image);

    try {
      await editInstitute(formData, institute.id); // API call
      toast({
        title: "Institución actualizada",
        description: "Los cambios se guardaron correctamente.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar la institución.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
        <svg width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar institución</DialogTitle>
          <DialogDescription>
            Modifica los datos de la institución y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEditInstitute)}>
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
                  <FormLabel>Observaciones</FormLabel>
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
                    Corporaciones <span className="text-red-500">*</span>
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
                  <FormLabel>Logo de la institución</FormLabel>
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
            {/* Show current image */}
            {institute.image && (
              <div className="mb-4 text-sm mt-1">
                Imagen actual:
                <p className="text-xs">
                  {institute.image?.split("/").pop() ?? ""}
                </p>
              </div>
            )}
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
