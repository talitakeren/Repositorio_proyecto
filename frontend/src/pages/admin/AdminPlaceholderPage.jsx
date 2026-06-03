import { useLocation } from "react-router-dom";
import { getPageTitle } from "../../utils/pageTitles.js";
import Card from "../../components/ui/Card.jsx";

export default function AdminPlaceholderPage() {
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-gray-500 sm:text-base">
          Módulo en desarrollo — PMV SGOHA
        </p>
      </div>
      <Card className="p-6 text-center text-sm text-gray-500 sm:p-8 sm:text-base">
        Esta sección estará disponible en la siguiente iteración del proyecto.
      </Card>
    </div>
  );
}
