
interface Corporation {
    id: string;
    name: string;
  }

  interface Graduate {
    id: number;
    name: string;
    credits: string;
    totalPrice: string;
    state: boolean;
    corporation: { corporation: Corporation }[];
  }

  interface GraduateResponse {
    totalGraduates: number;
    result: Graduate[];
  }

interface FetchGraduatesParams {
  offset: number;
  limit: number;
  token: string;
  search?: string;
}

export const GraduateAllList = async ({
  offset,
  limit,
  token,
  search,
}: FetchGraduatesParams): Promise<GraduateResponse> => {
  try {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/graduates/search/?limit=${limit}&offset=${offset}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
console.log("ofsset", offset)
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Error response:", errorBody);
    throw new Error("Failed to fetch graduates list");
  }

  const data = await response.json();
  if (!data || typeof data.totalGraduates === 'undefined') {
    console.error("Unexpected response format:", data);
    throw new Error("Invalid response format: totalGraduates is missing");
  }

 return {
   totalGraduates: data.totalGraduates,
   result: data.result as Graduate[],
 };
  } catch (error) {
    console.log(error)
    throw error;
  }
};
