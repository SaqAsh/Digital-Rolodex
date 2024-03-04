import { getToken } from "next-auth/jwt";
import validator from "@/libs/validator";

export async function GET(request, context) {
  try {
    const { cardId } = context.params;

    const card = await database.card.findUnique({
      where: {
        id: cardId,
      },
    });

    return new Response(JSON.stringify(card), {
      status: 200,
    });
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

    const body = await request.json();
    const parsedData = validator.card.parse(body);

    const updatedCard = await database.card.update({
      data: {
        image: parsedData.image,
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        address: parsedData.address,
      },
      select: {
        id: true,
      },
      where: {
        id: cardId,
        userId: token["id"],
      },
    });

    return new Response(JSON.stringify(updatedCard), {
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

    const deletedCard = await database.card.delete({
      select: {
        id: true,
      },
      where: {
        id: cardId,
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
