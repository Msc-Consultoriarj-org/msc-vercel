CREATE TYPE "public"."category" AS ENUM('library', 'framework', 'tool', 'service', 'platform');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('slack', 'github', 'manus');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('planning', 'active', 'paused', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "communicationIntegrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"employeeId" integer NOT NULL,
	"platform" "platform" NOT NULL,
	"externalId" varchar(200),
	"accessToken" text,
	"refreshToken" text,
	"tokenExpiresAt" timestamp,
	"connectedAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "communicationIntegrations_employeeId_platform_unique" UNIQUE("employeeId","platform")
);
--> statement-breakpoint
CREATE TABLE "dependencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"category" "category" NOT NULL,
	"version" varchar(50),
	"description" text,
	"documentationUrl" text,
	"installationGuide" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"fullName" text NOT NULL,
	"avatarUrl" text,
	"position" varchar(100),
	"department" varchar(100),
	"hireDate" timestamp,
	"status" "status" DEFAULT 'active' NOT NULL,
	"bio" text,
	"phone" varchar(20),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectDependencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"dependencyId" integer NOT NULL,
	"versionUsed" varchar(50),
	"addedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projectDependencies_projectId_dependencyId_unique" UNIQUE("projectId","dependencyId")
);
--> statement-breakpoint
CREATE TABLE "projectMembers" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"employeeId" integer NOT NULL,
	"role" varchar(100),
	"joinedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projectMembers_projectId_employeeId_unique" UNIQUE("projectId","employeeId")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"githubRepoUrl" text,
	"status" "project_status" DEFAULT 'planning' NOT NULL,
	"startDate" timestamp,
	"endDate" timestamp,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "communicationIntegrations" ADD CONSTRAINT "communicationIntegrations_employeeId_employees_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectDependencies" ADD CONSTRAINT "projectDependencies_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectDependencies" ADD CONSTRAINT "projectDependencies_dependencyId_dependencies_id_fk" FOREIGN KEY ("dependencyId") REFERENCES "public"."dependencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectMembers" ADD CONSTRAINT "projectMembers_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectMembers" ADD CONSTRAINT "projectMembers_employeeId_employees_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_createdBy_employees_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;