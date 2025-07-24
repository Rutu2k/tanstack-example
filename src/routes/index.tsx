import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CustomTable } from "../shared/CustomTable";
import { fetchCharacters } from "../api/characters";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["characters", pageIndex + 1],
    queryFn: fetchCharacters,
  });

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Status", accessorKey: "status" },
    { header: "Species", accessorKey: "species" },
    { header: "Gender", accessorKey: "gender" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div>
      <CustomTable
        data={data?.characters.results || []}
        columns={columns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        totalPages={data?.characters.info.pages || 1}
      />
    </div>
  );
}
