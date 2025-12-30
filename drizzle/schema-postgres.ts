import { integer, pgEnum, pgTable, text, timestamp, varchar, unique, serial } from "drizzle-orm/pg-core";

/**
 * PostgreSQL Schema for Supabase (Production)
 * Adapted from MySQL schema for Vercel deployment
 */

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("status", ["active", "inactive"]);
export const projectStatusEnum = pgEnum("project_status", ["planning", "active", "paused", "completed", "archived"]);
export const categoryEnum = pgEnum("category", ["library", "framework", "tool", "service", "platform"]);
export const platformEnum = pgEnum("platform", ["slack", "github", "manus"]);

/**
 * Core user table backing auth flow
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Employees table - extends user information with company-specific data
 */
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  fullName: text("fullName").notNull(),
  avatarUrl: text("avatarUrl"),
  position: varchar("position", { length: 100 }),
  department: varchar("department", { length: 100 }),
  hireDate: timestamp("hireDate"),
  status: statusEnum("status").default("active").notNull(),
  bio: text("bio"),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Projects table - manages company projects
 */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  githubRepoUrl: text("githubRepoUrl"),
  status: projectStatusEnum("status").default("planning").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdBy: integer("createdBy").notNull().references(() => employees.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Project members - links employees to projects
 */
export const projectMembers = pgTable("projectMembers", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  employeeId: integer("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
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
export const dependencies = pgTable("dependencies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  category: categoryEnum("category").notNull(),
  version: varchar("version", { length: 50 }),
  description: text("description"),
  documentationUrl: text("documentationUrl"),
  installationGuide: text("installationGuide"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Dependency = typeof dependencies.$inferSelect;
export type InsertDependency = typeof dependencies.$inferInsert;

/**
 * Project dependencies - links dependencies to projects
 */
export const projectDependencies = pgTable("projectDependencies", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  dependencyId: integer("dependencyId").notNull().references(() => dependencies.id, { onDelete: "cascade" }),
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
export const communicationIntegrations = pgTable("communicationIntegrations", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId").notNull().references(() => employees.id, { onDelete: "cascade" }),
  platform: platformEnum("platform").notNull(),
  externalId: varchar("externalId", { length: 200 }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  tokenExpiresAt: timestamp("tokenExpiresAt"),
  connectedAt: timestamp("connectedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  uniqueEmployeePlatform: unique().on(table.employeeId, table.platform),
}));

export type CommunicationIntegration = typeof communicationIntegrations.$inferSelect;
export type InsertCommunicationIntegration = typeof communicationIntegrations.$inferInsert;
