import { type Patient } from "./patients.schema";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Patient>();

const PATIENT_LIST_COLUMNS = [
  columnHelper.accessor("first_name", {
    header: () => "First Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("last_name", {
    header: () => "Last Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: () => "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("contact_number", {
    header: () => "Contact Number",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("date_of_birth", {
    header: () => "Date of Birth",
    cell: (info) => info.getValue().toLocaleDateString(),
  }),
];

export { PATIENT_LIST_COLUMNS };
