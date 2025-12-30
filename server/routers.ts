import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  employees: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllEmployees();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const employee = await db.getEmployeeById(input.id);
        if (!employee) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Funcionário não encontrado" });
        }
        return employee;
      }),
    
    getByUserId: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getEmployeeByUserId(input.userId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        userId: z.number(),
        fullName: z.string().min(1),
        avatarUrl: z.string().optional(),
        position: z.string().optional(),
        department: z.string().optional(),
        hireDate: z.date().optional(),
        status: z.enum(["active", "inactive"]).default("active"),
        bio: z.string().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createEmployee(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        fullName: z.string().min(1).optional(),
        avatarUrl: z.string().optional(),
        position: z.string().optional(),
        department: z.string().optional(),
        hireDate: z.date().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        bio: z.string().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateEmployee(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEmployee(input.id);
        return { success: true };
      }),
  }),

  projects: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllProjects();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const project = await db.getProjectById(input.id);
        if (!project) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Projeto não encontrado" });
        }
        return project;
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        githubRepoUrl: z.string().optional(),
        status: z.enum(["planning", "active", "paused", "completed", "archived"]).default("planning"),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        createdBy: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.createProject(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        githubRepoUrl: z.string().optional(),
        status: z.enum(["planning", "active", "paused", "completed", "archived"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        return { success: true };
      }),
    
    getMembers: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectMembers(input.projectId);
      }),
    
    addMember: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        employeeId: z.number(),
        role: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.addProjectMember(input);
        return { success: true };
      }),
    
    removeMember: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        employeeId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.removeProjectMember(input.projectId, input.employeeId);
        return { success: true };
      }),
    
    getDependencies: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectDependencies(input.projectId);
      }),
    
    addDependency: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        dependencyId: z.number(),
        versionUsed: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.addProjectDependency(input);
        return { success: true };
      }),
    
    removeDependency: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        dependencyId: z.number(),
      }))
      .mutation(async ({ input }) => {
        await db.removeProjectDependency(input.projectId, input.dependencyId);
        return { success: true };
      }),
  }),

  dependencies: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllDependencies();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const dependency = await db.getDependencyById(input.id);
        if (!dependency) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Dependência não encontrada" });
        }
        return dependency;
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        category: z.enum(["library", "framework", "tool", "service", "platform"]),
        version: z.string().optional(),
        description: z.string().optional(),
        documentationUrl: z.string().optional(),
        installationGuide: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createDependency(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        category: z.enum(["library", "framework", "tool", "service", "platform"]).optional(),
        version: z.string().optional(),
        description: z.string().optional(),
        documentationUrl: z.string().optional(),
        installationGuide: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateDependency(id, data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDependency(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
