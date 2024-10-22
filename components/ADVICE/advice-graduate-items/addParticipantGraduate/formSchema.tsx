import { fileSchema } from "@/lib/file-schema";
import { z } from "zod";

export const formSchema = z.object({
  fullName: z.string().min(1, { message: "Campo requerido." }),
  documentType: z.enum(["dni", "passport", "other"]).optional(),
  documentNumber: z.string().min(1, { message: "Campo requerido." }),
  address: z.string().optional(),
  gender: z.string().optional(),
  email: z
  .string()
  .min(1, { message: "Campo requerido." })
  .email("Esto no es un correo válido."),
  occupation: z.string().optional(),
  form: z.string().optional(),
  phone: z.string().min(1, { message: "Campo requerido." }),
  birthDate: z.date().optional(),
  identDoc: fileSchema, // Apply file validation here
  signMatricula: fileSchema, // Apply file validation here
  studyDoc: fileSchema, // Apply file validation here
})
.superRefine((values, ctx) => {
  const { documentType, documentNumber } = values;

  // Validación para DNI: exactamente 8 dígitos numéricos
  if (documentType === "dni" && !/^[0-9]{8}$/.test(documentNumber)) {
    ctx.addIssue({
      path: ["documentNumber"],
      code: z.ZodIssueCode.custom,
      message: "DNI debe contener exactamente 8 dígitos numéricos",
    });
  }

  // Validación para Pasaporte: letras y números
  if (documentType === "passport" && !/^[a-zA-Z0-9]+$/.test(documentNumber)) {
    ctx.addIssue({
      path: ["documentNumber"],
      code: z.ZodIssueCode.custom,
      message: "Pasaporte debe contener solo letras y números",
    });
  }

});
