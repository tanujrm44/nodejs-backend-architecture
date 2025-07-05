import { vi } from "vitest"

export const KeyStoreModelMock = {
  create: vi.fn(),
  find: vi.fn(),
  deleteOne: vi.fn(),
}

export const KeyStoreModel = KeyStoreModelMock 