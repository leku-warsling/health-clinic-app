import { useQuery } from "react-query";
import { getPatients, getClinics } from "../patients.api";
import { DEFAULT_QUERY_PARAMS, TABLE_COLUMNS } from "../patients.constants";
import { assoc, dissoc, equals, complement } from "ramda";
import {
  RiMentalHealthLine,
  RiArrowRightLine,
  RiAddLine,
  RiFilter2Line,
} from "react-icons/ri";
import {
  Flex,
  Card,
  CardBody,
  FormControl,
  Select,
  FormLabel,
  Icon,
  Input,
  Spacer,
  Divider,
  Button,
} from "@chakra-ui/react";
import {
  Pagination,
  Loader,
  PageHeader,
  NoResultsAlert,
  SearchInput,
  Table,
} from "@components";
import { PatientParamsSchema } from "../patients.schema";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { flow } from "fp-ts/lib/function";
import { PatientQueryParams } from "../patients.types";
import { isEmptyResult, isRequesting, resetOffset } from "../patients.util";
import debounce from "lodash-es/debounce";

const isClearable = complement(
  equals<PatientQueryParams>(DEFAULT_QUERY_PARAMS),
);

export const PatientsListPage = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [params, setParams] =
    useState<PatientQueryParams>(DEFAULT_QUERY_PARAMS);

  const patients = useQuery({
    queryKey: ["patients-list", params],
    queryFn: () => getPatients({ params: PatientParamsSchema.parse(params) }),
    keepPreviousData: true,
  });

  const clinics = useQuery({
    queryKey: ["clinics-list"],
    queryFn: () => getClinics(),
  });

  const onClearFilters = () => {
    setParams(DEFAULT_QUERY_PARAMS);
    if (searchRef?.current) {
      searchRef.current.value = "";
    }
  };

  const setOffsetParam = (offset: number) => {
    setParams(assoc("offset", offset));
  };

  const setDateOfBirthParam = (date: string, op: "gte" | "lte") => {
    const action = date ? assoc(op, date) : dissoc(op);

    setParams(({ date_of_birth, ...state }) => ({
      ...state,
      date_of_birth: action(date_of_birth || {}),
      offset: 0,
    }));
  };

  const setClinicParam = (id: string) => {
    const action = id ? assoc("clinic_id", id) : dissoc("clinic_id");
    setParams(flow(action, resetOffset));
  };

  const setLimitParam = (limit: number) => {
    setParams(flow(assoc("limit", limit), resetOffset));
  };

  const setOrderParam = (column: string) => {
    const isActive = params.sort?.column === column;
    const order = isActive ? "desc" : "asc";
    if (isActive && params.sort?.order === "desc") {
      setParams(dissoc("sort"));
      return;
    }
    setParams(assoc("sort", { column, order }));
  };

  const setSearchParam = useMemo(() => {
    return debounce((event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setParams((state) => {
        if (value.length >= 3) {
          return {
            ...state,
            q: value,
            offset: 0,
          };
        }
        if (state.q) {
          return dissoc("q", state);
        }
        return state;
      });
    }, 500);
  }, []);

  const filters = (
    <Flex gap={6}>
      <FormControl maxW="200px">
        <FormLabel fontWeight={600}>Clinic:</FormLabel>
        <Select
          value={params?.clinic_id || ""}
          onChange={(e) => setClinicParam(e.target.value)}
        >
          <option value="">All</option>
          {clinics.data?.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl maxW="375px">
        <FormLabel fontWeight={600}>Date of Birth:</FormLabel>
        <Flex align="center" gap={2}>
          <Input
            type="date"
            value={params.date_of_birth?.gte || ""}
            onChange={(e) => setDateOfBirthParam(e.target.value, "gte")}
          />
          <Icon as={RiArrowRightLine} />
          <Input
            type="date"
            value={params.date_of_birth?.lte || ""}
            onChange={(e) => setDateOfBirthParam(e.target.value, "lte")}
          />
        </Flex>
      </FormControl>
      {isClearable(params) && (
        <Button
          w="fit-content"
          leftIcon={<RiFilter2Line />}
          color="primary"
          variant="link"
          alignSelf="flex-end"
          lineHeight="40px"
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
      <Spacer />
      <FormControl maxW="300px" alignSelf="flex-end">
        <SearchInput
          placeholder="Enter search term..."
          ref={searchRef}
          onChange={setSearchParam}
        />
      </FormControl>
    </Flex>
  );

  return (
    <Flex direction="column" py={8} gap={8}>
      <PageHeader
        title="Patients"
        subtitle={`${patients.data?.total ?? 0} Records Found`}
        icon={RiMentalHealthLine}
        actions={
          <Button
            leftIcon={<RiAddLine />}
            bg="primary"
            color="white"
            _hover={{ bg: "#7356c4" }}
          >
            Add Patient
          </Button>
        }
      />
      <Card size="lg" boxShadow="none">
        <CardBody display="flex" flexDirection="column" gap={8}>
          {filters}
          <Divider borderColor="gray.300" />
          <Flex
            minH="400px"
            position="relative"
            direction="column"
            align="center"
          >
            <NoResultsAlert
              hidden={!isEmptyResult(patients)}
              onClear={onClearFilters}
              my={4}
              w="100%"
              maxW="600px"
            />
            {isRequesting(patients) && <Loader />}
            <Table
              hidden={patients.isLoading || isEmptyResult(patients)}
              columns={TABLE_COLUMNS}
              data={patients.data?.data || []}
              onSort={setOrderParam}
              sortBy={params.sort}
            />
          </Flex>
          <Pagination
            isLoading={patients.isLoading}
            onSizeChange={setLimitParam}
            total={patients.data?.total ?? 0}
            onChange={setOffsetParam}
            pageSize={params.limit}
            offset={params.offset}
            showSizeChanger
          />
        </CardBody>
      </Card>
    </Flex>
  );
};
