import { z } from "zod";
import { ENV } from "./_core/env";

export type AdminAccount = {
  email: string;
  password: string;
  name?: string;
  openId?: string;
};

const adminAccountSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().optional(),
  openId: z.string().optional(),
});

const sanitizeOpenId = (email: string) => {
  const normalized = email.trim().toLowerCase();
  const slug = normalized.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const base = slug.length > 0 ? slug : "admin";
  const prefixed = `admin-${base}`;
  return prefixed.slice(0, 64);
};

const parseJsonAccounts = () => {
  if (!ENV.adminAccountsJson) return [] as AdminAccount[];

  try {
    const parsed = JSON.parse(ENV.adminAccountsJson);
    const accounts = z.array(adminAccountSchema).parse(parsed);
    return accounts;
  } catch (error) {
    console.warn("[Admin Accounts] Failed to parse ADMIN_ACCOUNTS_JSON:", error);
    return [] as AdminAccount[];
  }
};

const getEnvAccount = (): AdminAccount[] => {
  if (!ENV.adminEmail || !ENV.adminPassword) return [];

  return [
    {
      email: ENV.adminEmail,
      password: ENV.adminPassword,
      name: ENV.adminName || undefined,
      openId: ENV.adminOpenId || ENV.ownerOpenId || sanitizeOpenId(ENV.adminEmail),
    },
  ];
};

const predefinedAccounts: AdminAccount[] = [
  {
    email: "moises.costa12345@gmail.com",
    password: "Moises@msc",
    name: "Moises Costa",
  },
  {
    email: "gabrielol2035@gmail.com",
    password: "Gabriel@msc",
    name: "Gabriel",
  },
  {
    email: "naiaramsc@gmail.com",
    password: "Naiara@msc",
    name: "Naiara",
  },
  {
    email: "recantodoacaienventosrj@gmail.com",
    password: "Recanto@2025",
    name: "Recanto Do Açaí Eventos RJ",
  },
  {
    email: "arquimedesmsc@gmail.com",
    password: "Arquimes@2025",
    name: "Arquimedes",
  },
];

const buildAccounts = () => {
  const accounts = [
    ...parseJsonAccounts(),
    ...getEnvAccount(),
    ...predefinedAccounts,
  ];

  const byEmail = new Map<string, AdminAccount>();

  for (const account of accounts) {
    const normalizedEmail = account.email.trim().toLowerCase();
    if (!normalizedEmail) continue;

    const normalized: AdminAccount = {
      ...account,
      email: normalizedEmail,
      openId: account.openId || sanitizeOpenId(account.email),
      name: account.name || normalizedEmail.split("@")[0],
    };

    if (!byEmail.has(normalizedEmail)) {
      byEmail.set(normalizedEmail, normalized);
    }
  }

  return Array.from(byEmail.values());
};

const adminAccounts = buildAccounts();

export const getAdminAccounts = () => adminAccounts;
export const getAdminAccountByEmail = (email: string) => {
  const normalized = email.trim().toLowerCase();
  return adminAccounts.find(account => account.email === normalized);
};
