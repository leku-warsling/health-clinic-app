export type PatientQueryParams = {
  limit: number;
  offset: number;
  sort?: {
    column: string;
    order: "asc" | "desc";
  };
  q?: string;
  date_of_birth?: {
    gte?: string;
    lte?: string;
  };
  clinic_id?: string;
};
