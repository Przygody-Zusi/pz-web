import { EmploymentType } from "@/types/employmentType";

export function renameEmploymentType(type: EmploymentType): string {
  switch (type) {
    case "employment_contract":
      return "Umowa o pracę";
    case "self_employed":
      return "B2B";
    case "mandate_contract":
      return "Umowa zlecenie";
    case "maternity_leave":
      return "Urlop macierzyński";
    case "parental_leave":
      return "Urlop rodzicielski";
    case "no_employment":
      return "Brak zatrudnienia";
    default:
      return "Nieznany typ zatrudnienia";
  }
}