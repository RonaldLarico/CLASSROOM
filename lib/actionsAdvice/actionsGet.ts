import { StudentGraduate, Graduate } from "@/lib/definitions";

// OBTENER DATOS DE ESTUDIANTE DE DIPLOMADO
interface FetchStudentGraduateDataParams {
  id: string;
}

export const fetchStudentGraduateData = async ({
  id,
}: FetchStudentGraduateDataParams): Promise<StudentGraduate | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/studentGraduate/${id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching student graduate data", error);
    return null;
  }
};

interface FetchGraduateDataParams {
  id: string;
  corporationId: string;
}

export const fetchGraduateData = async ({ id, corporationId }: FetchGraduateDataParams): Promise<Graduate | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate/${id}/corporation/${corporationId}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching graduate data', error);
    return null;
  }
};

interface FetchGraduatesParams {
  offset: number;
  limit: number;
  token: string;
}

export const fetchGraduatesData = async ({
  offset,
  limit,
  token,
}: FetchGraduatesParams): Promise<Graduate[]> => {
  console.log("Fetching graduates with offset:", offset, "and limit:", limit, "and token:", token);
  
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduate/corporation/?limit=${limit}&offset=${offset}`,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Error response:', errorBody);
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
  }

  const data = await response.json();
  console.log("Fetched graduates data:", data);

  if (!Array.isArray(data)) {
    console.error('Unexpected data format:', data);
    throw new Error('Received data is not an array of graduates');
  }

  return data as Graduate[];
};