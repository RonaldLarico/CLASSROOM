import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ParticipantPrimaryInfo from "./participant-personal-info";
import { StudentGraduate } from "@/lib/definitions";
import { fetchStudentGraduateData } from "@/lib/actionsAdvice/actionsGet";
import { AdviceGraduateSkeleton } from "@/components/skeletons/advice/skeletonGraduate";
import ParticipantFinancialInfo from "../financial-info/participant-finance-info";
interface ParticipantDetailsProps {
  participant: string;
  graduatePrice: number;
}

export default function ParticipantDetails({
  participant,
  graduatePrice,
}: ParticipantDetailsProps) {
  const [graduateStudent, setGraduateStudent] =
    useState<StudentGraduate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setGraduateStudent(null);
      setError(null);

      try {
        const data = await fetchStudentGraduateData({ id: participant });
        setGraduateStudent(data);
      } catch (e) {
        setError("Error fetching student data");
        console.error("Error fetching student data", e);
      }
    };

    fetchData();
  }, [participant]);

  if (error) {
    return (
      <Card className="mt-4 ">
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!graduateStudent) {
    return <AdviceGraduateSkeleton />;
  }
  
  return (
    <Card className="mt-4">
      <CardContent>
        {graduateStudent && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold">
                {graduateStudent.fullName}
              </h2>
              {/*               <EditParticipantModal
                graduateId={1}
                participantId={1}
                participantData={graduateStudent}
              /> */}
            </div>
            <Tabs defaultValue="personalInfo">
              <TabsList>
                <TabsTrigger value="personalInfo">
                  Información personal
                </TabsTrigger>
                <TabsTrigger value="personalFinance">
                  Información financiera
                </TabsTrigger>
                <TabsTrigger value="access">Credenciales de acceso</TabsTrigger>
                <TabsTrigger value="certificates">Certificados</TabsTrigger>
                <TabsTrigger value="status">Estado diploma</TabsTrigger>
              </TabsList>

              <TabsContent value="personalInfo">
                <ParticipantPrimaryInfo participant={graduateStudent} />
              </TabsContent>

              <TabsContent value="personalFinance">
                <ParticipantFinancialInfo participant={graduateStudent} totalPrice={graduatePrice} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
