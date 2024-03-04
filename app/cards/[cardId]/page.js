import Page from "@/app/cards/[cardId]/_page";

export const metadata = {
  title: "Card",
};

export default async function CardPage({ params }) {
  return <Page />;
}
