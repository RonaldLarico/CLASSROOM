// lib/actionsAdvice/actionsGet.ts
import { Graduate } from "@/lib/definitions";

export const fetchGraduateData = async ({ id, corporationId }: { id: string, corporationId: number }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate/${id}?corporationId=${corporationId.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch graduate data');
  const data: Graduate = await res.json();
  return data;
};