import "server-only";
import { PrismaClient } from "@prisma/client";

let database = global.database ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.database = database;

export default database;
