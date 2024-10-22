'use client';

import { ContentLayout } from "@/components/side-panel/content-layout";
import { SearchStudent } from "@/components/ADVICE/advice-dashboard-items/search-student";
import { SearchGraduate } from "@/components/ADVICE/advice-dashboard-items/search-graduate";
import { SearchCourse } from "@/components/ADVICE/advice-dashboard-items/search-course";
import GraduateList from "@/components/ADVICE/advice-dashboard-items/graduate-copyDetails";
import { DetallesCurso } from "@/components/ADVICE/advice-dashboard-items/course-copyDetails";
import ProtectedRoute from "@/components/loginPage/auth-protection";
import { Suspense } from "react";

function InicioPageAdvice() {
  const requiredRoles = ["ADVICE", "SUPER_ADMIN", "ADMIN"];

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <ContentLayout title="Inicio">
        <SearchStudent />
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-6 lg:gap-12">
          <div className="">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-xl font-semibold mb-2 sm:mb-0">
                Diplomados próximos a iniciar
              </h2>
              <SearchGraduate aria-label="Buscar diplomados" />
            </div>
            <div className="">

              <GraduateList />

            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-xl font-semibold mb-2 sm:mb-0">
                Cursos próximos a iniciar
              </h2>
              <SearchCourse aria-label="Buscar cursos" />
            </div>
            <div>
              <DetallesCurso />
            </div>
          </div>
        </div>
      </ContentLayout>
    </ProtectedRoute>
  );
}

export default InicioPageAdvice;