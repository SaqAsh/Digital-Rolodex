import { Image } from "@nextui-org/react";
export default function Card({
  image,
  name,
  email,
  phone,
  address,
  occupation = null,
  href_url = null,
  onClick = null,
}) {
  return (
    <div
      className={`p-4 w-[600px] h-[350px] shadow-2xl rounded-2xl bg-white ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className={"grid grid-cols-12 m-12 mt-16"} onClick={onClick}>
        <div className={"col-span-8"}>
          <h1 className={"text-black text-4xl"}>{name}</h1>
          {occupation && (
            <h2 className={"text-black text-2xl"}>{occupation}</h2>
          )}
          <br />
          <br />
          <h3 className={"text-gray-600 text-xl"}>{email}</h3>
          <h3 className={"text-gray-600 text-xl"}>{phone}</h3>
          <h3 className={"text-gray-600 text-xl"}>{address}</h3>
        </div>
        <div className={"col-span-4 mt-4"}>
          <Image src={image} width={400} className={"rounded-xl"} />
        </div>
      </div>
      {href_url && (
        <div className="flex justify-left m-12">
          <a href={href_url} className="text-white bg-teal-300 hover:bg-teal-500 focus:ring-4 focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 light:bg-teal-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Go to Card</a>
        </div>
      )}
    </div>
  );
}
