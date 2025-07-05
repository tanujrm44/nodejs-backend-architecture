import { vi } from "vitest"

const UserModelMock = {
  findOne: vi.fn(),
  create: vi.fn(),
}

export default UserModelMock
