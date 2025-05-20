import { vi } from "vitest"

const KeyStoreModelMock = {
  find: vi.fn(),
  create: vi.fn(),
}

export default KeyStoreModelMock
export const KeyStoreModel = KeyStoreModelMock
