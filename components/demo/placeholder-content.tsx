import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

export default function PlaceholderContent() {
  return (
    <div className="flex flex-row w-full">
      <Card className="rounded-lg border-none mt-6 w-full mr-2">
        <CardContent className="p-6">
          <div className="flex flex-row justify-between ">
            <div>Exámenes próximos a iniciar</div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-lg border-none mt-6 w-full">
        <CardContent className="p-6">
          <div className="flex flex-row justify-between">
            <div>Modulos próximos a iniciar</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
