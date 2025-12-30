import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, unique } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Employees table - extends user information with company-specific data
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("fullName").notNull(),
  avatarUrl: text("avatarUrl"),
  position: varchar("position", { length: 100 }),
  department: varchar("department", { length: 100 }),
  hireDate: timestamp("hireDate"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  bio: text("bio"),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Projects table - manages company projects
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  githubRepoUrl: text("githubRepoUrl"),
  status: mysqlEnum("status", ["planning", "active", "paused", "completed", "archived"]).default("planning").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdBy: int("createdBy").notNull().references(() => employees.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Project members - links employees to projects
 */
export const projectMembers = mysqlTable("projectMembers", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  employeeId: int("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 100 }),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
}, (table) => ({
  uniqueProjectEmployee: unique().on(table.projectId, table.employeeId),
}));

export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = typeof projectMembers.$inferInsert;

/**
 * Dependencies catalog - tracks technologies and tools
 */
export const dependencies = mysqlTable("dependencies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["library", "framework", "tool", "service", "platform"]).notNull(),
  version: varchar("version", { length: 50 }),
  description: text("description"),
  documentationUrl: text("documentationUrl"),
  installationGuide: text("installationGuide"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dependency = typeof dependencies.$inferSelect;
export type InsertDependency = typeof dependencies.$inferInsert;

/**
 * Project dependencies - links dependencies to projects
 */
export const projectDependencies = mysqlTable("projectDependencies", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  dependencyId: int("dependencyId").notNull().references(() => dependencies.id, { onDelete: "cascade" }),
  versionUsed: varchar("versionUsed", { length: 50 }),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
}, (table) => ({
  uniqueProjectDependency: unique().on(table.projectId, table.dependencyId),
}));

export type ProjectDependency = typeof projectDependencies.$inferSelect;
export type InsertProjectDependency = typeof projectDependencies.$inferInsert;

/**
 * Communication integrations - stores OAuth tokens for external services
 */
export const communicationIntegrations = mysqlTable("communicationIntegrations", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  platform: mysqlEnum("platform", ["slack", "github", "manus"]).notNull(),
  externalId: varchar("externalId", { length: 200 }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  connectedAt: timestamp("connectedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueEmployeePlatform: unique().on(table.employeeId, table.platform),
}));

export type CommunicationIntegration = typeof communicationIntegrations.$inferSelect;
export type InsertCommunicationIntegration = typeof communicationIntegrations.$inferInsert;
