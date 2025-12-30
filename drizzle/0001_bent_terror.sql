CREATE TABLE `communicationIntegrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`platform` enum('slack','github','manus') NOT NULL,
	`externalId` varchar(200),
	`accessToken` text,
	`refreshToken` text,
	`tokenExpiresAt` timestamp,
	`connectedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `communicationIntegrations_id` PRIMARY KEY(`id`),
	CONSTRAINT `communicationIntegrations_employeeId_platform_unique` UNIQUE(`employeeId`,`platform`)
);
--> statement-breakpoint
CREATE TABLE `dependencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`category` enum('library','framework','tool','service','platform') NOT NULL,
	`version` varchar(50),
	`description` text,
	`documentationUrl` text,
	`installationGuide` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dependencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` text NOT NULL,
	`avatarUrl` text,
	`position` varchar(100),
	`department` varchar(100),
	`hireDate` timestamp,
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`bio` text,
	`phone` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projectDependencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`dependencyId` int NOT NULL,
	`versionUsed` varchar(50),
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectDependencies_id` PRIMARY KEY(`id`),
	CONSTRAINT `projectDependencies_projectId_dependencyId_unique` UNIQUE(`projectId`,`dependencyId`)
);
--> statement-breakpoint
CREATE TABLE `projectMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`employeeId` int NOT NULL,
	`role` varchar(100),
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `projectMembers_id` PRIMARY KEY(`id`),
	CONSTRAINT `projectMembers_projectId_employeeId_unique` UNIQUE(`projectId`,`employeeId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`githubRepoUrl` text,
	`status` enum('planning','active','paused','completed','archived') NOT NULL DEFAULT 'planning',
	`startDate` timestamp,
	`endDate` timestamp,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `communicationIntegrations` ADD CONSTRAINT `communicationIntegrations_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectDependencies` ADD CONSTRAINT `projectDependencies_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectDependencies` ADD CONSTRAINT `projectDependencies_dependencyId_dependencies_id_fk` FOREIGN KEY (`dependencyId`) REFERENCES `dependencies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectMembers` ADD CONSTRAINT `projectMembers_projectId_projects_id_fk` FOREIGN KEY (`projectId`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projectMembers` ADD CONSTRAINT `projectMembers_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_createdBy_employees_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `employees`(`id`) ON DELETE no action ON UPDATE no action;