import { isProd } from "./constants";
import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { User } from "./entities/User";
import { UserArea } from "./entities/UserArea";
import { Performance } from "./entities/Performance";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"), // path to the folder with migrations
    pattern: /^[\w-]+\d+\.[tj]s$/, // regex pattern for the migration files
  },
  user: "keenanhumm",
  entities: [User, Performance, UserArea],
  dbName: "lireddit",
  debug: !isProd,
  type: "postgresql",
} as Parameters<typeof MikroORM.init>[0];