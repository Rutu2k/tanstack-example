// Define the CharactersResponse type
type CharactersResponse = {
  characters: {
    info: {
      next: number | null;
      prev: number | null;
      pages: number;
    };
    results: {
      id: string;
      name: string;
      status: string;
      species: string;
      gender: string;
    }[];
  };
};

export const fetchCharacters = async ({
  queryKey,
}: {
  queryKey: [string, number];
}) => {
  const [, page] = queryKey;
  const response = await fetch("https://rickandmortyapi.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
          query ($page: Int) {
            characters(page: $page) {
              info {
                next
                prev
                pages
              }
              results {
                id
                name
                status
                species
                gender
              }
            }
          }
        `,
      variables: { page },
    }),
  });

  const data: { data: CharactersResponse } = await response.json();
  return data.data;
};


export const fetchCharacterById = async (id: string) => {
    const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    const data = await response.json();
    return { character: data };
  };