import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacterById } from "../../api/characters";

export const Route = createFileRoute("/character/$id")({
  component: CharacterDetails,
});

function CharacterDetails() {
  const { id } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchCharacterById(id),
  });

  if (isLoading) return <div>Loading character details...</div>;
  if (isError) return <div>Error loading character details</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <button
        onClick={() => window.history.back()}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back
      </button>
      {data ? (
        <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {data.character.name}
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {data.character.status}
            </p>
            <p>
              <span className="font-semibold">Species:</span>{" "}
              {data.character.species}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {data.character.gender}
            </p>
            <p>
              <span className="font-semibold">Origin:</span>{" "}
              {data.character.origin?.name || "Unknown"}
            </p>
            <p>
              <span className="font-semibold">Location:</span>{" "}
              {data.character.location?.name || "Unknown"}
            </p>
            <p>
              <span className="font-semibold">Episodes:</span>{" "}
              {data.character.episode?.length || 0}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">
          No character data available
        </div>
      )}
    </div>
  );
}
