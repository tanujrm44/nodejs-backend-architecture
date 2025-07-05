import { it, describe, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import app from "../../src/app"
import { Types } from "mongoose"
import UserModelMock from "../../src/models/__mocks__/userModel"
import { RoleModelMock, RoleCode } from "../../src/models/__mocks__/roleModel"
import { KeyStoreModelMock } from "../../src/models/__mocks__/keyStoreModel"

vi.mock("../../src/models/userModel")
vi.mock("../../src/models/roleModel")
vi.mock("../../src/models/keyStoreModel")

describe("Tests the register functionality", () => {
  // Arrange
  const endpoint = "/api/users/register"
  const userPayload = {
    name: "John",
    email: "john@example.com",
    password: "123456",
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should register a user", async () => {
    const roleId = new Types.ObjectId()
    RoleModelMock.findOne.mockResolvedValue({
      _id: roleId,
      code: RoleCode.USER,
      status: true,
    })

    const userId = new Types.ObjectId()
    UserModelMock.create.mockResolvedValue({
      _id: userId,
      name: userPayload.name,
      email: userPayload.email,
      roles: [roleId],
    })

    KeyStoreModelMock.create.mockResolvedValue({
      _id: new Types.ObjectId(),
      client: userId,
      primaryKey: expect.any(String),
      secondaryKey: expect.any(String),
    })

    // Act
    const res = await request(app).post(endpoint).send(userPayload)

    // Assert
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      name: userPayload.name,
      email: userPayload.email,
    })
    expect(res.body._id).toBeDefined()
    expect(UserModelMock.findOne).toHaveBeenCalledWith({
      email: userPayload.email,
    })
    expect(RoleModelMock.findOne).toHaveBeenCalledWith({
      code: RoleCode.USER,
      status: true,
    })
    expect(KeyStoreModelMock.create).toHaveBeenCalled()
  })

  it("should not register if user already exists", async () => {
    // Mock existing user
    UserModelMock.findOne.mockResolvedValue({
      _id: new Types.ObjectId(),
      name: userPayload.name,
      email: userPayload.email,
    })

    // Act
    const res = await request(app).post(endpoint).send(userPayload)

    // Assert
    expect(res.status).toBe(400)
    expect(res.body.message).toBe("User already exists")
    expect(UserModelMock.create).not.toHaveBeenCalled()
    expect(RoleModelMock.findOne).not.toHaveBeenCalled()
    expect(KeyStoreModelMock.create).not.toHaveBeenCalled()
  })

  it("should return 400 with an invalid email", async () => {
    const invalidPayload = { ...userPayload, email: "invalid-email" }

    const response = await request(app).post(endpoint).send(invalidPayload)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("Inavlid email")
    expect(UserModelMock.findOne).not.toHaveBeenCalled()
    expect(UserModelMock.create).not.toHaveBeenCalled()
    expect(KeyStoreModelMock.create).not.toHaveBeenCalled()
  })

  it("should return 400 with an invalid password", async () => {
    const invalidPayload = { ...userPayload, password: "123" }

    const response = await request(app).post(endpoint).send(invalidPayload)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe(
      "Password must be at least 6 characters long"
    )
    expect(UserModelMock.findOne).not.toHaveBeenCalled()
    expect(UserModelMock.create).not.toHaveBeenCalled()
    expect(KeyStoreModelMock.create).not.toHaveBeenCalled()
  })

  it("should return 400 with missing email and password", async () => {
    const invalidPayload = { name: userPayload.name }

    const response = await request(app).post(endpoint).send(invalidPayload)

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/required/i)
    expect(UserModelMock.findOne).not.toHaveBeenCalled()
    expect(UserModelMock.create).not.toHaveBeenCalled()
    expect(KeyStoreModelMock.create).not.toHaveBeenCalled()
  })

  it("should not set cookies if registration fails due to duplicate email", async () => {
    UserModelMock.findOne.mockResolvedValue({
      _id: "existing_user_id",
      name: "Existing User",
      email: userPayload.email,
    })

    await request(app).post(endpoint).send(userPayload)
    const response = await request(app).post(endpoint).send(userPayload)

    expect(response.status).toBe(400)
    expect(response.headers["set-cookie"]).toBeUndefined()
    expect(UserModelMock.create).not.toHaveBeenCalled()
    expect(KeyStoreModelMock.create).not.toHaveBeenCalled()
  })

  it("should set accessToken and refreshToken cookies on successful registration", async () => {
    UserModelMock.findOne.mockResolvedValue(null)
    UserModelMock.create.mockResolvedValue({
      _id: new Types.ObjectId(),
      name: userPayload.name,
      email: userPayload.email,
      roles: [],
    })
    KeyStoreModelMock.create.mockResolvedValue({
      accessToken: "access_token",
      refreshToken: "refresh_token",
    })

    const response = await request(app).post(endpoint).send(userPayload)

    expect(response.status).toBe(201)
    expect(response.headers["set-cookie"]).toBeDefined()

    const cookies = Array.isArray(response.headers["set-cookie"])
      ? response.headers["set-cookie"]
      : []

    expect(
      cookies.some((cookie: string) => cookie.startsWith("accessToken="))
    ).toBe(true)
    expect(
      cookies.some((cookie: string) => cookie.startsWith("refreshToken="))
    ).toBe(true)
  })

  it("should generate tokens with the correct payload", async () => {
    UserModelMock.findOne.mockResolvedValue(null)
    UserModelMock.create.mockResolvedValue({
      _id: new Types.ObjectId(),
      name: userPayload.name,
      email: userPayload.email,
      roles: [],
    })
    KeyStoreModelMock.create.mockResolvedValue({
      accessToken: "access_token",
      refreshToken: "refresh_token",
    })

    const response = await request(app).post(endpoint).send(userPayload)

    expect(response.status).toBe(201)

    const cookies = Array.isArray(response.headers["set-cookie"])
      ? response.headers["set-cookie"]
      : []

    const accessTokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith("accessToken=")
    )
    const refreshTokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith("refreshToken=")
    )

    expect(accessTokenCookie).toBeDefined()
    expect(refreshTokenCookie).toBeDefined()
  })
})
