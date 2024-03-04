"use client";

import CardForm from "@/components/CardForm";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";

export default function Page() {
  const { cardId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [card, setCard] = useState({});

  useEffect(() => {
    (async function () {
      const response = await fetch(`/api/cards/${cardId}`);
      if (response.ok) {
        const data = await response.json();
        setCard(data);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return (
    <CardForm
      id={cardId}
      image={card.image}
      name={card.name}
      email={card.email}
      phone={card.phone}
      address={card.address}
    />
  );
}
