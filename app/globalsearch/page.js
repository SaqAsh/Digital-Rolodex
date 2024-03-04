"use client";

import { signOut, useSession } from "next-auth/react";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { FaCircleUser, FaPenToSquare } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Card from "@/components/Card";
import Link from 'next/link'

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const isFirstRender = useRef(true);

  const tab = searchParams.get("tab");

  const [occupationFilter, setOccupationFilter] = useState([]);

  // Adding a string to occupationFilter
  const addOccupation = (newOccupation) => {
    setOccupationFilter([...occupationFilter, newOccupation]);
  };

  // Removing a string from occupationFilter
  const removeOccupation = (occupationToRemove) => {
    setOccupationFilter(occupationFilter.filter(occupation => occupation !== occupationToRemove));
  };

  const occupationsList = ["Software Engineer", "Unemployed", "Janitor", "Retail Clerk"];

  const handleCheckboxChange = (event, occupation) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      addOccupation(occupation);
    } else {
      removeOccupation(occupation);
    }
  };

  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  useEffect(() => {
    // Skip the effect on the initial render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    (async function () {
      const response = await fetch("/api/cards/global", {
        method: "POST",
        body: JSON.stringify({
          filters: occupationFilter,
          name_filter: name
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedCards(data.created);
      }
    })();
    if (tab && ["created", "held"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [occupationFilter, name]);

  const [createdCards, setCreatedCards] = useState([]);
  const [heldCards, setHeldCards] = useState([]);
  const [activeTab, setActiveTab] = useState("created");

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (session.status === "authenticated") {
    return (
      <div>
        <Navbar maxWidth={"full"}>
          <NavbarBrand onClick={() => router.push("/")}>
            <span
              className={
                "flex items-center space-x-2 text-3xl font-bold text-primary"
              }
            >
              Digital Rolodex
            </span>
          </NavbarBrand>
          <NavbarContent as="div">
            <Link href="/globalsearch">
              Global Search
            </Link>
          </NavbarContent>
          <NavbarContent as="div" justify="end">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div>
                  <FaCircleUser
                    className={"text-gray-500 w-7 h-7 cursor-pointer"}
                  />
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session.data.user.email}</p>
                </DropdownItem>
                <DropdownItem
                  color="danger"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </Navbar>
        <div
          className={
            "flex flex-col h-full w-full justify-center items-center content-center px-6 mt-4"
          }
        >
          <div
            className={"relative w-full flex  justify-center items-center mb-4"}
          >
            <h1 className={"w-full text-4xl font-semibold text-center mx-auto"}>
              Global Search
            </h1>
          </div>


          <div className="relative inline-block text-left flex">
            <button
              id="dropdownHelperButton"
              onClick={toggleDropdown}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              type="button"
            >
              Filter by Occupation
              <svg
                className={`w-2.5 h-2.5 ms-3 ${isOpen ? 'transform rotate-180' : ''}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div className="ml-4">
              <input
                value={name}
                onChange={handleNameChange}
                id="helper-text"
                aria-describedby="helper-text-explanation"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Name"
              />
            </div>
            {isOpen && (
              <div
                id="dropdownHelper"
                className="z-10 absolute right-0 mt-2 w-60 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHelperButton">
                  {occupationsList.map((occupation, index) => (
                    <li key={index}>
                      <div className="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                        <div className="flex items-center h-5">
                          <input
                            id={`helper-checkbox-${index}`}
                            aria-describedby={`helper-checkbox-text-${index}`}
                            type="checkbox"
                            value={occupation}
                            checked={occupationFilter.includes(occupation)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                            onChange={(event) => handleCheckboxChange(event, occupation)}
                          />
                        </div>
                        <div className="ms-2 text-sm">
                          <label htmlFor={`helper-checkbox-${index}`} className="font-medium text-gray-900 dark:text-gray-300">
                            <div>{occupation}</div>
                          </label>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {createdCards.map((card, index) => (
            <div class="mt-3">
            <Card
              key={index}
              image={card.image}
              name={card.name}
              occupation={card.occupation}
              email={card.email}
              phone={card.phone}
              address={card.address}
              onClick={() => router.push(`/cards/${card.id}/edit`)}
              href_url={`/cards/${card.id}/`}
            />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (session.status === "unauthenticated") {
    return (
      <div
        className={
          "flex flex-col h-full w-full justify-center items-center content-center"
        }
      >
        <span className={"text-4xl font-bold text-primary mb-12"}>
          Digital Rolodex
        </span>
        <div className={"justify-center items-center content-center"}>
          <Button
            color="primary"
            size="lg"
            radius="lg"
            variant="solid"
            className={"m-4"}
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </Button>
          <Button
            color="primary"
            size="lg"
            radius="lg"
            variant="bordered"
            className={"m-4"}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    );
  } else {
    return <div className={""}></div>;
  }
}
