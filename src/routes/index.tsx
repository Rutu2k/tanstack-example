import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CustomTable } from "../shared/CustomTable";
import { fetchCharacters } from "../api/characters";
import { z } from "zod";

// Define search params schema
const searchSchema = z.object({
  page: z.number().min(1).catch(1), // Default to page 1 if invalid
});

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: searchSchema,
});

function Index() {
  const navigate = Route.useNavigate();
  const { page } = Route.useSearch();

  const pageIndex = page - 1; // Convert to 0-based index
  const pageSize = 20;

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["characters", page],
    queryFn: fetchCharacters,
  });

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Name", accessorKey: "name" },
    { header: "Status", accessorKey: "status" },
    { header: "Species", accessorKey: "species" },
    { header: "Gender", accessorKey: "gender" },
  ];

  const handlePageChange = (newPageIndex: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: newPageIndex + 1, // Convert back to 1-based page number
      }),
    });
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleRowClick = ({ id }: string | any) => {
    navigate({
      to: `/character/${id}`,
      search: true,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded shadow">
        <h1 className="text-3xl font-bold text-gray-800">Characters</h1>
        <button
          onClick={handleRefresh}
          disabled={isFetching}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow"
        >
          {isFetching ? (
            <>
              <span className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Refreshing...
            </>
          ) : (
            "Refresh"
          )}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <CustomTable
          data={data?.characters.results || []}
          columns={columns}
          pageIndex={pageIndex}
          pageSize={pageSize}
          setPageIndex={handlePageChange}
          totalPages={data?.characters.info.pages || 1}
          onRowClick={handleRowClick} // Pass the row click handler
        />
      </div>
    </div>
  );
}
