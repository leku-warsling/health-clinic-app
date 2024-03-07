import { useQuery } from "react-query";
import { getPatients, getClinics } from "../patients.api";
import { PATIENT_LIST_COLUMNS } from "../patients.constants";
import { assoc, dissoc, assocPath, dissocPath, equals } from "ramda";
import {
  RiMentalHealthLine,
  RiArrowRightLine,
  RiSearchLine,
  RiAddLine,
  RiArrowDropDownFill,
  RiArrowDropUpFill,
  RiQuestionLine,
  RiFilter2Line,
} from "react-icons/ri";
import {
  Flex,
  Heading,
  Card,
  CardBody,
  FormControl,
  Select,
  FormLabel,
  Icon,
  Skeleton,
  Input,
  Spacer,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  Button,
  Box,
  Spinner,
  Text,
  CardHeader,
} from "@chakra-ui/react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { Pagination } from "@components";
import { Patient, PatientParamsSchema } from "../patients.schema";
import { useEffect, useState } from "react";
import { flow } from "fp-ts/lib/function";
import { useDebounce } from "@hooks";

type PatientQueryParams = {
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

const resetOffset = assoc("offset", 0);

const DEFAULT_PARAMS = {
  limit: 10,
  offset: 0,
  sort: {
    column: "first_name",
    order: "asc",
  },
} as const;

export const PatientsListPage = () => {
  const [params, setParams] = useState<PatientQueryParams>(DEFAULT_PARAMS);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (debouncedSearchValue.length >= 3) {
      setParams(assoc("q", debouncedSearchValue));
    } else if (params.q) {
      setParams(dissoc("q"));
    }
  }, [debouncedSearchValue]);

  const patients = useQuery({
    queryKey: ["patients-list", params],
    queryFn: () => getPatients({ params: PatientParamsSchema.parse(params) }),
    keepPreviousData: true,
  });

  const clinics = useQuery({
    queryKey: ["clinics-list"],
    queryFn: () => getClinics(),
  });

  const table = useReactTable({
    columns: PATIENT_LIST_COLUMNS,
    data: patients.data?.data || [],
    getCoreRowModel: getCoreRowModel<Patient>(),
  });

  const clearFilters = () => {
    setParams(DEFAULT_PARAMS);
    setSearchValue("");
  };

  const totalNumberOfPages = patients.data?.total
    ? Math.ceil(patients.data.total / params.limit)
    : 0;

  return (
    <Flex direction="column" py={8} gap={8}>
      <Flex align="center" gap={2}>
        <Flex align="flex-end" gap={2}>
          <Icon as={RiMentalHealthLine} fontSize="40px" />
          <Heading as="h1" fontWeight={600} lineHeight={0.9}>
            Patients
          </Heading>
          <Heading size="md" fontWeight={500}>
            - {patients.data?.total ?? 0} Records Found
          </Heading>
        </Flex>
        <Spacer />
        <Button
          leftIcon={<RiAddLine />}
          bg="primary"
          color="white"
          textTransform="uppercase"
          _hover={{
            bg: "#7356c4",
          }}
        >
          Add Patient
        </Button>
      </Flex>
      <Card size="lg" boxShadow="none">
        <CardBody display="flex" flexDirection="column" gap={8}>
          <Flex gap={6}>
            <FormControl maxW="200px">
              <Skeleton isLoaded={!patients.isLoading && !clinics.isLoading}>
                <FormLabel fontWeight={600}>Clinic:</FormLabel>
              </Skeleton>
              <Skeleton isLoaded={!patients.isLoading && !clinics.isLoading}>
                <Select
                  value={params?.clinic_id || ""}
                  onChange={(e) => {
                    const id = e.target.value;
                    const action = id
                      ? assoc("clinic_id", id)
                      : dissoc("clinic_id");

                    setParams(flow(action, resetOffset));
                  }}
                >
                  <option value="">All</option>
                  {clinics.data?.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </Select>
              </Skeleton>
            </FormControl>
            <FormControl maxW="375px">
              <Skeleton isLoaded={!patients.isLoading}>
                <FormLabel fontWeight={600}>Date of Birth:</FormLabel>
              </Skeleton>
              <Flex align="center" gap={2}>
                <Skeleton isLoaded={!patients.isLoading}>
                  <Input
                    type="date"
                    value={params.date_of_birth?.gte || ""}
                    onChange={(e) => {
                      const date = e.target.value;
                      const action = date
                        ? assocPath(["date_of_birth", "gte"], date)
                        : dissocPath(["date_of_birth", "gte"]);

                      setParams(flow(action, resetOffset));
                    }}
                  />
                </Skeleton>
                <Icon as={RiArrowRightLine} />
                <Skeleton isLoaded={!patients.isLoading}>
                  <Input
                    type="date"
                    value={params.date_of_birth?.lte || ""}
                    onChange={(e) => {
                      const date = e.target.value;
                      const action = date
                        ? assocPath(["date_of_birth", "lte"], date)
                        : dissocPath(["date_of_birth", "lte"]);

                      setParams(flow(action, resetOffset));
                    }}
                  />
                </Skeleton>
              </Flex>
            </FormControl>
            {!equals(params, DEFAULT_PARAMS) && (
              <Button
                w="fit-content"
                leftIcon={<RiFilter2Line />}
                color="primary"
                variant="link"
                alignSelf="flex-end"
                lineHeight="40px"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
            <Spacer />
            <FormControl maxW="300px" alignSelf="flex-end">
              <Skeleton isLoaded={!patients.isLoading}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<RiSearchLine color="gray.400" />}
                  />
                  <Input
                    value={searchValue}
                    onChange={(e) => {
                      setSearchValue(e.target.value);
                    }}
                    placeholder="Enter search term..."
                  />
                </InputGroup>
              </Skeleton>
            </FormControl>
          </Flex>
          <Divider borderColor="gray.300" />
          <Box minH="400px" position="relative">
            {!patients.isLoading && !patients.data?.data.length && (
              <Flex
                align="center"
                bg="gray.200"
                rounded={12}
                px={8}
                py={6}
                gap={2}
              >
                <Icon as={RiQuestionLine} fontSize="3xl" />
                <Text fontWeight={600} fontSize="lg">
                  No results found
                </Text>
                <Spacer />
                <Button
                  w="fit-content"
                  leftIcon={<RiFilter2Line />}
                  color="primary"
                  borderColor="primary"
                  variant="outline"
                  alignSelf="flex-end"
                  lineHeight="40px"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </Flex>
            )}
            {(patients.isLoading || patients.isFetching) && (
              <Flex
                position="absolute"
                top={0}
                left={0}
                justify="center"
                align="center"
                w="100%"
                h="100%"
                bg="whiteAlpha.700"
              >
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="primary"
                  size="xl"
                />
              </Flex>
            )}
            {!!patients.data?.data.length && (
              <Table>
                <Thead bg="primary">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <Th
                          key={header.id}
                          color="white"
                          py={3}
                          fontSize="sm"
                          _hover={{ cursor: "pointer" }}
                          onClick={() => {
                            const column = header.id;
                            const isActive = params.sort?.column === column;
                            const order = isActive ? "desc" : "asc";
                            if (isActive && params.sort?.order === "desc") {
                              setParams(dissoc("sort"));
                              return;
                            }
                            setParams(assoc("sort", { column, order }));
                          }}
                        >
                          <Flex as="span" align="center" gap={2}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <Flex
                              align="center"
                              direction="column"
                              fontSize="20px"
                              gap={0}
                            >
                              <Icon
                                as={RiArrowDropUpFill}
                                opacity={
                                  header.id === params.sort?.column &&
                                  params.sort.order === "asc"
                                    ? 1
                                    : 0.5
                                }
                                mb="-12px"
                              />
                              <Icon
                                as={RiArrowDropDownFill}
                                opacity={
                                  header.id === params.sort?.column &&
                                  params.sort.order === "desc"
                                    ? 1
                                    : 0.5
                                }
                              />
                            </Flex>
                          </Flex>
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </Thead>
                <Tbody fontWeight={500}>
                  {table.getRowModel().rows.map((row) => (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <Td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
          {totalNumberOfPages > 1 && (
            <Pagination
              onSizeChange={(limit) => {
                setParams(flow(assoc("limit", limit), resetOffset));
              }}
              pageSize={params.limit}
              onChange={(page) => {
                setParams(assoc("offset", (page - 1) * params.limit));
              }}
              current={params.offset / params.limit + 1}
              total={totalNumberOfPages}
              isLoading={patients.isLoading}
              showSizeChanger
            />
          )}
        </CardBody>
      </Card>
    </Flex>
  );
};
