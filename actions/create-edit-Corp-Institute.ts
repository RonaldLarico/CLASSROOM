"use server";

import { revalidatePath } from "next/cache";

export async function createCorp(formData: FormData) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporation`, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();
  console.log(responseData);
  revalidatePath("/corporations");
}

export async function editCorp(formData: FormData, id: number) {
  console.log(formData);
  formData.delete("id");
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporation/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textResponse = await response.text(); // Handle plain text response
    revalidatePath(`/corporations`);
    return textResponse;
  } catch (error) {
    console.error("Error in editCorp:", error);
    throw error;
  }
}

export async function createInstitute(formData: FormData) {
  console.log(formData);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/institute`, {
    method: "POST",
    body: formData,
  });

  const responseData = await response.json();
  console.log(responseData);
  revalidatePath("/corporations");
}

export async function editInstitute(formData: FormData, id: number) {
  console.log(formData);
  formData.delete("id");
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/updateInstitute/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textResponse = await response.text(); // Handle plain text response
    revalidatePath(`/corporations`);
    return textResponse;
  } catch (error) {
    console.error("Error in editCorp:", error);
    throw error;
  }
}