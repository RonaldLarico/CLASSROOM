"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import CreateSession from "../createSchedule/createSession";
import ChildrenFormModule from "./childrenFormModule";
import createModule from "@/actions/ADMIN/postModules";

const moduleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  code: z.string().min(1, "El código es obligatorio"),
  topics: z.array(z.string().min(1, "Debe ingresar al menos un tema")),
  hours: z.string().min(1, "Las horas son obligatorias"),
  totalPrice: z.number().min(0, "El precio total es obligatorio"),
  state: z.boolean(),
  checkImage: z.boolean(),
  numArrays: z.number().min(1, "Número de arrays es obligatorio"),
  corporationIds: z
    .array(z.number().min(0))
    .nonempty("Corporaciones es obligatorio"),
  amountIds: z
    .array(z.number().min(0))
    .nonempty("Cantidad por corporación es obligatorio"),
});

interface ModuleFormDialogProps {
  onSaveModule: (module: any) => void;
}

const ModuleForm = ({ onSaveModule }: ModuleFormDialogProps) => {
  const form = useForm({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
      code: "",
      topics: [],
      hours: "",
      totalPrice: 0,
      state: false,
      checkImage: false,
      session: [],
      numArrays: 4,
      corporationIds: "1, 2, 3, 4, 5, 6, 7, 8",
      amountIds: "2, 2, 2, 2",
    },
  });

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  const [savedModules, setSavedModules] = useState<any[]>([]);

const handleSave = async (data: any) => {
  setIsSaving(true);
  try {
    const allData = { ...data, session: sessionData };
    const { numArrays, corporationIds, amountIds, session, ...moduleData } = data;
    if (!numArrays || !corporationIds || !amountIds) {
      throw new Error("Faltan los campos numArrays, corporationIds o amountIds en el módulo.");
    }

    const newModule = {
        ...moduleData,
        session: sessionData || session,
    };
    const updatedModules = [...savedModules, newModule];

    const formattedData = {
      modules: updatedModules,
      numArrays,
      corporationIds,
      amountIds,
    };

    console.log("Datos guardados:", JSON.stringify(formattedData, null, 2));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSaveModule(formattedData);
    setSavedModules(updatedModules);
    form.reset();
  } catch (error) {
    console.error("Error al guardar el módulo:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "No se pudo crear el Diplomado.",
    });
  } finally {
    setIsSaving(false);
  }
};

  return (
    <Dialog>
      <div className="flex justify-between">
        <DialogTrigger asChild>
          <Button variant="outline">Agregar Módulos</Button>
        </DialogTrigger>

          {/* <Button onClick={handleCreateSchedule}>Crear Cronograma</Button> */}

      </div>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[600px] lg:max-w-[900px] xl:max-w-[1200px] dark:bg-blue-950/80">
        <DialogHeader>
          <DialogTitle>Crear Módulo</DialogTitle>
          <DialogDescription>
            Completa los detalles del módulo. Haz clic en guardar cuando hayas
            terminado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              const formattedData = {
                ...data,
                topics: data.topics
                  .join("\n")
                  .split("\n")
                  .filter((topic) => topic.trim() !== ""),
              };
              handleSave(formattedData);
            })}
            className="grid grid-cols-2 gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del módulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input placeholder="Código del módulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas</FormLabel>
                  <FormControl>
                    <Input placeholder="Duración en horas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Total</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Precio total"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="checkbox"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verificación de Imagen</FormLabel>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="checkbox"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Temas</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Ingrese los temas, separados por línea y comience con '-' para cada tema"
                      className="textarea resize-none p-2 border rounded-md w-full"
                      rows={1}
                      style={{ overflow: "hidden", minHeight: "50px" }}
                      {...field}
                      onChange={(e) => {
                        const textarea = e.target as HTMLTextAreaElement;
                        textarea.style.height = "auto";
                        textarea.style.height = `${textarea.scrollHeight}px`;
                        const newValue = textarea.value;
                        const topicsArray = newValue.split("\n");
                        field.onChange(topicsArray);
                      }}
                      onBlur={() => {
                        if (Array.isArray(field.value)) {
                          const newTopics = field.value
                            .filter((line: string) => line.trim() !== "")
                            .map((topic: string) => topic.trim());

                          field.onChange(newTopics);
                        }
                      }}
                      value={
                        Array.isArray(field.value) ? field.value.join("\n") : ""
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <CreateSession setSessionData={setSessionData} />
        <DialogFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit((data) => {
              setIsSaving(true);
              handleSave(data).finally(() => {
                setIsSaving(false);
              });
            })}
          >
            {isSaving ? "Guardando..." : "Guardar Módulo"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="flex justify-center gap-4 py-4 border-t mt-5"
        >
          <ChildrenFormModule control={form.control} />
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ModuleForm;
