'use client';
import React, { Suspense, useEffect, useState } from "react";
import { fetchGraduateData } from "@/lib/actionsAdvice/actionsGet";
import { Card, CardContent } from "@/components/ui/card";
import AddParticipantModal from "../addParticipantGraduate/add-participant-modal";
import { useUser } from "@/context/dataUserContext";
import { useSearchParams } from "next/navigation";
import { Graduate } from "@/lib/definitions";


// GraduateDataFetch.tsx
const GraduateDataFetch = ({ onDataFetch }: { onDataFetch: (data: Graduate | null) => void }) => {
  const { corporationId } = useUser();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [data, setData] = useState<Graduate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await fetchGraduateData({ id: id || "", corporationId });
      setData(fetchedData);
      onDataFetch(fetchedData); // Envía los datos al componente padre
    };

    fetchData();
  }, [id, corporationId, onDataFetch]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-xl font-semibold">Diplomado: {data?.name || ""}</h1>
        <AddParticipantModal totalPrice={data?.totalPrice || 0} graduateId={Number(data?.id)} />
      </div>
      {data && (

        <Card className="mt-2">
          <CardContent>
            <div>
              <h4 className="font-semibold">Información del diplomado:</h4>
              <h3 className="font-semibold">
                Fecha de inicio: <span className="font-normal">{new Date(data.startDate).toLocaleDateString()}</span>
              </h3>
              <h3 className="font-semibold">
                Fecha de finalización: <span className="font-normal">{new Date(data.endDate).toLocaleDateString()}</span>
              </h3>
              <h3 className="font-semibold">
                Código del evento: <span className="font-normal">{data.code}</span>
              </h3>
              <h3 className="font-semibold">Instituciones: <span className="font-normal"></span></h3>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GraduateDataFetch;
