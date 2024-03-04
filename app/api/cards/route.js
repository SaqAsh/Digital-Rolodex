import { getToken } from "next-auth/jwt";
import validator from "@/libs/validator";

export async function GET(request, context) {
  try {
    const token = await getToken({ req: request });

    const createdCards = await database.card.findMany({
      where: {
        userId: token["id"],
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const heldCards = await database.heldCard.findMany({
      include: {
        card: true,
      },
      where: {
        userId: token["id"],
      },
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

export async function POST(request, context) {
  try {
    const token = await getToken({ req: request });
    const body = await request.json();
    const parsedData = validator.card.parse(body);

    const newCard = await database.card.create({
      data: {
        userId: token["id"],
        image: parsedData.image,
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        address: parsedData.address,
        occupation: parsedData.occupation,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(newCard), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(null, {
      status: 400,
    });
  }
}
