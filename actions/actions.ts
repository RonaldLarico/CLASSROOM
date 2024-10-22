"use server";
import { revalidatePath } from "next/cache";

export async function addParticipant(data: FormData, token: string, graduateId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/studentGraduate/${graduateId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  if (!res.ok) {
    throw new Error("Error al guardar el participante");
  }

  const participantData = await res.json();
  revalidatePath('/advice-dashboard/graduate')
  return participantData[0]; // Devuelve los datos del participante
}

