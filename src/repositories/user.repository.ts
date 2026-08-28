import type { User, UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateUserData {
  clerkId: string;
  email: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  role?: UserRole;
}

export const userRepository = {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  },

  async findByClerkId(clerkId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { clerkId } });
  },

  /** Slim row for session checks — avoids pulling phone/avatar/timestamps. */
  async findByClerkIdForSession(clerkId: string) {
    return prisma.user.findUnique({
      where: { clerkId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
      },
    });
  },

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  },

  async create(data: CreateUserData): Promise<User> {
    return prisma.user.create({ data });
  },

  async update(
    id: string,
    data: Partial<Omit<CreateUserData, "clerkId">>,
  ): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  },

  async upsertByClerkId(data: CreateUserData): Promise<User> {
    return prisma.user.upsert({
      where: { clerkId: data.clerkId },
      create: data,
      update: {
        email: data.email,
        name: data.name,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
      },
    });
  },

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  },

  async count(): Promise<number> {
    return prisma.user.count();
  },
};
