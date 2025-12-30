import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  employees,
  InsertEmployee,
  projects,
  InsertProject,
  projectMembers,
  InsertProjectMember,
  dependencies,
  InsertDependency,
  projectDependencies,
  InsertProjectDependency,
  communicationIntegrations,
  InsertCommunicationIntegration
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ EMPLOYEES ============

export async function getAllEmployees() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: employees.id,
      userId: employees.userId,
      fullName: employees.fullName,
      avatarUrl: employees.avatarUrl,
      position: employees.position,
      department: employees.department,
      hireDate: employees.hireDate,
      status: employees.status,
      bio: employees.bio,
      phone: employees.phone,
      email: users.email,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
    })
    .from(employees)
    .leftJoin(users, eq(employees.userId, users.id))
    .orderBy(desc(employees.createdAt));
  
  return result;
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select({
      id: employees.id,
      userId: employees.userId,
      fullName: employees.fullName,
      avatarUrl: employees.avatarUrl,
      position: employees.position,
      department: employees.department,
      hireDate: employees.hireDate,
      status: employees.status,
      bio: employees.bio,
      phone: employees.phone,
      email: users.email,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
    })
    .from(employees)
    .leftJoin(users, eq(employees.userId, users.id))
    .where(eq(employees.id, id))
    .limit(1);
  
  return result[0];
}

export async function getEmployeeByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(employees)
    .where(eq(employees.userId, userId))
    .limit(1);
  
  return result[0];
}

export async function createEmployee(employee: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(employees).values(employee);
  return result;
}

export async function updateEmployee(id: number, employee: Partial<InsertEmployee>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(employees).set(employee).where(eq(employees.id, id));
}

export async function deleteEmployee(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(employees).where(eq(employees.id, id));
}

// ============ PROJECTS ============

export async function getAllProjects() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      githubRepoUrl: projects.githubRepoUrl,
      status: projects.status,
      startDate: projects.startDate,
      endDate: projects.endDate,
      createdBy: projects.createdBy,
      creatorName: employees.fullName,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .leftJoin(employees, eq(projects.createdBy, employees.id))
    .orderBy(desc(projects.createdAt));
  
  return result;
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      githubRepoUrl: projects.githubRepoUrl,
      status: projects.status,
      startDate: projects.startDate,
      endDate: projects.endDate,
      createdBy: projects.createdBy,
      creatorName: employees.fullName,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
    })
    .from(projects)
    .leftJoin(employees, eq(projects.createdBy, employees.id))
    .where(eq(projects.id, id))
    .limit(1);
  
  return result[0];
}

export async function createProject(project: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projects).values(project);
  return result;
}

export async function updateProject(id: number, project: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(projects).set(project).where(eq(projects.id, id));
}

export async function deleteProject(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projects).where(eq(projects.id, id));
}

// ============ PROJECT MEMBERS ============

export async function getProjectMembers(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: projectMembers.id,
      projectId: projectMembers.projectId,
      employeeId: projectMembers.employeeId,
      role: projectMembers.role,
      joinedAt: projectMembers.joinedAt,
      employeeName: employees.fullName,
      employeePosition: employees.position,
      employeeAvatar: employees.avatarUrl,
    })
    .from(projectMembers)
    .leftJoin(employees, eq(projectMembers.employeeId, employees.id))
    .where(eq(projectMembers.projectId, projectId))
    .orderBy(desc(projectMembers.joinedAt));
  
  return result;
}

export async function addProjectMember(member: InsertProjectMember) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projectMembers).values(member);
  return result;
}

export async function removeProjectMember(projectId: number, employeeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projectMembers).where(
    and(
      eq(projectMembers.projectId, projectId),
      eq(projectMembers.employeeId, employeeId)
    )
  );
}

// ============ DEPENDENCIES ============

export async function getAllDependencies() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(dependencies)
    .orderBy(desc(dependencies.createdAt));
  
  return result;
}

export async function getDependencyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db
    .select()
    .from(dependencies)
    .where(eq(dependencies.id, id))
    .limit(1);
  
  return result[0];
}

export async function createDependency(dependency: InsertDependency) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(dependencies).values(dependency);
  return result;
}

export async function updateDependency(id: number, dependency: Partial<InsertDependency>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(dependencies).set(dependency).where(eq(dependencies.id, id));
}

export async function deleteDependency(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(dependencies).where(eq(dependencies.id, id));
}

// ============ PROJECT DEPENDENCIES ============

export async function getProjectDependencies(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select({
      id: projectDependencies.id,
      projectId: projectDependencies.projectId,
      dependencyId: projectDependencies.dependencyId,
      versionUsed: projectDependencies.versionUsed,
      addedAt: projectDependencies.addedAt,
      dependencyName: dependencies.name,
      dependencyCategory: dependencies.category,
      dependencyDescription: dependencies.description,
      dependencyDocUrl: dependencies.documentationUrl,
    })
    .from(projectDependencies)
    .leftJoin(dependencies, eq(projectDependencies.dependencyId, dependencies.id))
    .where(eq(projectDependencies.projectId, projectId))
    .orderBy(desc(projectDependencies.addedAt));
  
  return result;
}

export async function addProjectDependency(projectDep: InsertProjectDependency) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(projectDependencies).values(projectDep);
  return result;
}

export async function removeProjectDependency(projectId: number, dependencyId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(projectDependencies).where(
    and(
      eq(projectDependencies.projectId, projectId),
      eq(projectDependencies.dependencyId, dependencyId)
    )
  );
}

// ============ COMMUNICATION INTEGRATIONS ============

export async function getEmployeeIntegrations(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(communicationIntegrations)
    .where(eq(communicationIntegrations.employeeId, employeeId));
  
  return result;
}

export async function upsertIntegration(integration: InsertCommunicationIntegration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(communicationIntegrations).values(integration).onDuplicateKeyUpdate({
    set: {
      externalId: integration.externalId,
      accessToken: integration.accessToken,
      refreshToken: integration.refreshToken,
      tokenExpiresAt: integration.tokenExpiresAt,
      updatedAt: new Date(),
    },
  });
}

export async function deleteIntegration(employeeId: number, platform: "slack" | "github" | "manus") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(communicationIntegrations).where(
    and(
      eq(communicationIntegrations.employeeId, employeeId),
      eq(communicationIntegrations.platform, platform)
    )
  );
}
