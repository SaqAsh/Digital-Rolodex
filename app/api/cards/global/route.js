import { getToken } from "next-auth/jwt";

export async function POST(request, context) {
  try {
    const token = await getToken({ req: request });
    const body = await request.json();

    // where filters for cards created
    let where_filters = {}

    if (body.filters.length > 0) {
      where_filters.occupation = {
        in: body.filters
      }
    }

    if (body.name_filter.length > 0) {
      where_filters.name = {
        startsWith: body.name_filter
      }
    }

    const createdCards = await database.card.findMany({
      where: where_filters,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return new Response(
      JSON.stringify({
        created: createdCards,
      }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
    });
  }
}
