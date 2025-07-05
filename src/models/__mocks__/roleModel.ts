import { vi } from "vitest"
import { Types } from "mongoose"

export enum RoleCode {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const RoleModelMock = {
  findOne: vi.fn(),
  find: vi.fn(),
  create: vi.fn(),
}

export const RoleModel = RoleModelMock
