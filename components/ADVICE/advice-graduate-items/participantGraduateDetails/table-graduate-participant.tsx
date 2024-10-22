'use client'; 
import React, { Suspense, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Graduate } from "@/lib/definitions";
import ParticipantDetails from "./participant-details";
import { AdviceGraduateSkeleton } from "@/components/skeletons/advice/skeletonGraduate";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // Import your Pagination components
import { Button } from "@/components/ui/button";

interface TableGraduateParticipantProps {
  graduateData: Graduate | null;
}

export default function TableGraduateParticipant({
  graduateData,
}: TableGraduateParticipantProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8); // Customize items per page

  useEffect(() => {
    const studentId = searchParams.get("studentId");
    if (studentId) {
      setSelectedParticipantId(studentId);
    }
  }, [searchParams]);

  const handleSelectParticipant = (participantId: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("studentId", participantId);
    router.push(`?${currentParams.toString()}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalItems = graduateData?.studentGraduate.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData =
    graduateData?.studentGraduate.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

    const renderPaginationItems = () => {
      const items = [];
      const maxVisiblePages = 3;
  
      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      } else {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              onClick={() => handlePageChange(1)}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        );
  
        if (currentPage > 3) {
          items.push(<PaginationItem key="start-ellipsis">...</PaginationItem>);
        }
  
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
  
        for (let i = start; i <= end; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
  
        if (currentPage < totalPages - 2) {
          items.push(<PaginationItem key="end-ellipsis">...</PaginationItem>);
        }
  
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
  
      return items;
    };

  return (
    <>
      <ScrollArea className="whitespace-nowrap rounded-md ">
        <Table className="mt-2 overflow-auto w-max max-h-96">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Nro.</TableHead>
              <TableHead>Nombres y apellidos</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Primera Cuota</TableHead>
              <TableHead>Segunda Cuota</TableHead>
              <TableHead>Tercera Cuota</TableHead>
              <TableHead>Cuarta Cuota</TableHead>
              <TableHead>Certificación</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Condición</TableHead>
              <TableHead>Acceso al aula virtual</TableHead>
              <TableHead>Diploma impreso</TableHead>
              <TableHead>Diploma enviado</TableHead>
              <TableHead>Certificados modulares enviados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map(({ studentGraduate }, index) => (
              <TableRow
                key={studentGraduate.id}
                onClick={() =>
                  handleSelectParticipant(studentGraduate.id.toString())
                }
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>{studentGraduate.fullName}</TableCell>
                <TableCell>{studentGraduate.documentNumber}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>
                  {studentGraduate.state ? "Aprobado" : "Desaprobado"}
                </TableCell>
                <TableCell>{studentGraduate.active ? "Sí" : "No"}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Pagination Component */}
      <Pagination className="mt-4 justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Anterior
            </Button>
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Siguiente
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Participant Details */}
      {selectedParticipantId ? (
        <Suspense fallback={<AdviceGraduateSkeleton />}>
          <ParticipantDetails graduatePrice={graduateData?.totalPrice || 0} participant={selectedParticipantId} />
        </Suspense>
      ) : (

        <div className="mt-4">
          Seleccione un participante para ver más detalles.
        </div>
      )}
    </>
  );
}
