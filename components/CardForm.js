"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import validator from "@/libs/validator";
import { useRouter } from "next/navigation";
import { Avatar, Button, Input } from "@nextui-org/react";
import { useEffect, useRef } from "react";

export default function CardForm({
  id = null,
  image = "",
  name = "",
  email = "",
  phone = "",
  address = "",
  occupation = "",
}) {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: zodResolver(validator.card),
    defaultValues: {
      image: image,
      name: name,
      email: email,
      phone: phone,
      address: address,
      occupation: occupation
    },
  });

  const router = useRouter();

  const fileInputRef = useRef();

  function imageOnChange(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      setValue("image", reader.result);
    };
  }

  async function onSubmit(data) {
    let url = "/api/cards";
    if (id) {
      url = `/api/cards/${id}`;
    }
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push("/");
    }
  }

  async function deleteOnClick() {
    const response = await fetch(`/api/cards/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={"flex flex-col gap-4 p-8"}
    >
      <Avatar
        src={watch("image") ?? " "}
        className="w-32 h-32 mx-auto cursor-pointer"
        onClick={() => fileInputRef.current.click()}
        showFallback
      />
      <input
        type={"file"}
        onChange={imageOnChange}
        multiple={false}
        ref={fileInputRef}
        hidden
      />
      {errors["image"]?.message.length > 0 && (
        <div className={"text-red-600 text-center"}>
          {errors["image"]?.message}
        </div>
      )}
      <br />
      <Input
        {...register("name")}
        defaultValue={getValues("name")}
        label={"Name"}
        variant={"faded"}
        size={"lg"}
        isInvalid={errors["name"]?.message.length > 0}
        errorMessage={errors["name"]?.message}
      />
      <Input
        {...register("email")}
        defaultValue={getValues("email")}
        label={"Email"}
        variant={"faded"}
        size={"lg"}
        isInvalid={errors["email"]?.message.length > 0}
        errorMessage={errors["email"]?.message}
      />
      <Input
        {...register("phone")}
        defaultValue={getValues("phone")}
        label={"Phone"}
        variant={"faded"}
        size={"lg"}
        isInvalid={errors["phone"]?.message.length > 0}
        errorMessage={errors["phone"]?.message}
      />
      <Input
        {...register("address")}
        defaultValue={getValues("address")}
        label={"Address"}
        variant={"faded"}
        size={"lg"}
        isInvalid={errors["address"]?.message.length > 0}
        errorMessage={errors["address"]?.message}
      />
      <Input
        {...register("occupation")}
        defaultValue={getValues("occupation")}
        label={"Occupation"}
        variant={"faded"}
        size={"lg"}
        isInvalid={errors["occupation"]?.message.length > 0}
        errorMessage={errors["occupation"]?.message}
      />
      <Button
        type="submit"
        color="primary"
        variant={"solid"}
        size={"lg"}
        className={"mt-4"}
        isLoading={isSubmitting}
      >
        {id ? "Update" : "Create"}
      </Button>

      {id && (
        <Button
          color="danger"
          variant={"solid"}
          size={"lg"}
          className={"mt-4"}
          onClick={deleteOnClick}
        >
          Delete
        </Button>
      )}
    </form>
  );
}
