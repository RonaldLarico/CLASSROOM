'use client';
import React, { useState } from "react";
import { ContentLayout } from "@/components/side-panel/content-layout";
import GraduateDataFetch from "../advice-graduate-items/participantGraduateDetails/graduateDataFetch";
import TableGraduateParticipant from "../advice-graduate-items/participantGraduateDetails/table-graduate-participant";
import { Graduate } from "@/lib/definitions";

export default function GraduateAdvice() {
  const [graduateData, setGraduateData] = useState<Graduate | null>(null);

  return (
    <ContentLayout title="Inicio">
      <GraduateDataFetch onDataFetch={setGraduateData} />
      <TableGraduateParticipant graduateData={graduateData} />
    </ContentLayout>
  );
}
