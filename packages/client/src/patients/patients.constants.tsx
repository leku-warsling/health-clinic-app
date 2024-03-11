import { render } from "react-dom";
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

const TABLE_COLUMNS = [
  {
    title: "First Name",
    accessor: "first_name",
    isSortable: true,
  },
  {
    title: "Last Name",
    accessor: "last_name",
    isSortable: true,
  },
  {
    title: "Email",
    accessor: "email",
    isSortable: true,
  },
  {
    title: "Contact Number",
    accessor: "contact_number",
    isSortable: true,
  },
  {
    title: "Date of Birth",
    accessor: "date_of_birth",
    isSortable: true,
    render: (value: Date) => value.toLocaleDateString(),
  },
];

const DEFAULT_QUERY_PARAMS = {
  limit: 10,
  offset: 0,
  sort: {
    column: "first_name",
    order: "asc",
  },
} as const;

export { PATIENT_LIST_COLUMNS, TABLE_COLUMNS, DEFAULT_QUERY_PARAMS };
