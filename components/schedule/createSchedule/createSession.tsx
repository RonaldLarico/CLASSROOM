import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sessionSchema = z.object({
  linkZoom: z.string().optional(),
  date: z.string().min(1, "La fecha es obligatoria"),
  hour: z.string().min(1, "La hora es obligatoria"),
  speakerId: z.number().optional(),
});

interface CreateSession {
  linkZoom?: string;
  date: string;
  hour: string;
  speakerId?: number;
}

const CreateSessionForm = ({ setSessionData }: { setSessionData: (data:any) => void }) => {

  const formMethods = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      linkZoom: "",
      date: "",
      hour: "",
      speakerId: undefined,
    },
  });

  const [numForms, setNumForms] = useState(1);

  const handleSelectChange = (value: string) => {
    setNumForms(Number(value));
  };

  const handleSaveSession = () => {
    const allData = Array.from({ length: numForms }, () => formMethods.getValues());
    console.log(allData);
    setSessionData(allData);
  };

  return (
    <FormProvider {...formMethods}>
      <div>
        <div className="mb-4">
          <FormItem>
            <FormLabel>Selecciona el número de sesiones</FormLabel>
            <FormControl>
              <Select
                value={numForms.toString()}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: numForms }).map((_, index) => (
            <form
              key={index}
              onSubmit={formMethods.handleSubmit((data) => {
                console.log(data);
              })}
              className="space-y-4 border border-violet-700 p-4 rounded-lg"
            >
              <h3 className="text-lg font-semibold">Sesión {index + 1}</h3>

              {/* Campo Link de Zoom */}
              <FormField
                control={formMethods.control}
                name="linkZoom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link de Zoom</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enlace de Zoom (opcional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Fecha */}
              <FormField
                control={formMethods.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Hora */}
              <FormField
                control={formMethods.control}
                name="hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo SpeakerId */}
              <FormField
                control={formMethods.control}
                name="speakerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ponente (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nombre del Ponente (opcional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          ))}
        </div>
        <Button className="mt-4" onClick={handleSaveSession}>
          Guardar todas las sesiones
        </Button>
      </div>
    </FormProvider>
  );
};

export default CreateSessionForm;
