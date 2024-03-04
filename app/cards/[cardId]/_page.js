"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { Button } from "@nextui-org/react";

export default function Page({}) {
  const router = useRouter();
  const { cardId } = useParams();

  const [card, setCard] = useState({});
  const [held, setHeld] = useState(false);

  useEffect(() => {
    (async function () {
      const cardResponse = await fetch(`/api/cards/${cardId}`);
      if (cardResponse.ok) {
        const cardData = await cardResponse.json();
        setCard(cardData);
      }

      const heldResponse = await fetch(`/api/held-cards/${cardId}`);
      if (heldResponse.ok) {
        const heldData = await heldResponse.json();
        setHeld(heldData.exist);
      }
    })();
  }, []);

  async function addOnClick() {
    const response = await fetch(`/api/held-cards/${cardId}`, {
      method: "POST",
    });

    if (response.ok) {
      router.push("/?tab=held");
    }
  }

  async function deleteOnClick() {
    const response = await fetch(`/api/held-cards/${cardId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/?tab=held");
    }
  }

  return (
    <div className={"flex flex-col justify-center items-center h-full w-full"}>
      <Card
        image={card.image}
        name={card.name}
        email={card.email}
        phone={card.phone}
        address={card.address}
      />
      {held ? (
        <Button
          color="danger"
          variant={"solid"}
          size={"lg"}
          className={"mt-4 w-72"}
          onClick={deleteOnClick}
        >
          Delete
        </Button>
      ) : (
        <Button
          color="primary"
          variant={"solid"}
          size={"lg"}
          className={"mt-4 w-72"}
          onClick={addOnClick}
        >
          Add
        </Button>
      )}
    </div>
  );
}
