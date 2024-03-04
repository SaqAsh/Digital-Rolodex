import { getToken } from "next-auth/jwt";
import validator from "@/libs/validator";

export async function GET(request, context) {
  try {
    const token = await getToken({ req: request });
    const { cardId } = context.params;

    const heldCard = await database.heldCard.findMany({
      where: {
        cardId: cardId,
        userId: token["id"],
      },
    });

    return new Response(
      JSON.stringify({
        exist: heldCard.length > 0,
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

export async function POST(request, context) {
  try {
    const token = await getToken({ req: request });
    const { cardId } = context.params;

    const newHeldCard = await database.heldCard.create({
      data: {
        userId: token["id"],
        cardId: cardId,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(newHeldCard), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
    });
  }
}

export async function DELETE(request, context) {
  try {
    const token = await getToken({ req: request });
    const { cardId } = context.params;

    const deletedCard = await database.heldCard.deleteMany({
      select: {
        count: true,
      },
      where: {
        cardId: cardId,
        userId: token["id"],
      },
    });

    return new Response(JSON.stringify(deletedCard), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
    });
  }
}
