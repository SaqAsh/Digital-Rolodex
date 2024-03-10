import { getToken } from "next-auth/jwt";

export async function POST(request, context) {
  try {
    const token = await getToken({ req: request });
    const body = await request.json();
    console.log(token);

    // where filters for cards created
    let where_filters = { userId: token["id"] }

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


    // where filters for held cards
    let where_filters_held_cards = { userId: token["id"] }

    if (body.filters.length > 0) {
      if (!where_filters_held_cards.card) {
        where_filters_held_cards.card = {}
      }
      where_filters_held_cards.card.occupation = {
        in: body.filters
      }
    }

    if (body.name_filter.length > 0) {
      if (!where_filters_held_cards.card) {
        where_filters_held_cards.card = {}
      }
      where_filters_held_cards.card.name = {
        startsWith: body.name_filter
      }
    }

    const heldCards = await database.heldCard.findMany({
      include: {
        card: true,
      },
      where: where_filters_held_cards,
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(
      JSON.stringify({
        created: createdCards,
        held: heldCards.map((heldCard) => heldCard.card),
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
