import express, { Request, Response } from "express"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

const router = express.Router()

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Todo API",
      version: "1.0.0",
      description: "Todo API",
    },
    tags: [
      {
        name: "todos",
        description: "Todos API",
      },
      {
        name: "users",
        description: "Users API",
      },
    ],
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT authorization of an API",
        },
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "API key authorization of an API",
        },
      },
      // schemas: {
      //   Todo: {
      //     type: "object",
      //     required: ["title", "description"],
      //     properties: {
      //       title: {
      //         type: "string",
      //         description: "Title of the todo",
      //       },
      //       description: {
      //         type: "string",
      //         description: "Detailed description of the todo",
      //       },
      //       completed: {
      //         type: "boolean",
      //         default: false,
      //         description: "Status of the todo",
      //       },
      //     },
      //   },
      // },
    },
  },
  apis: ["./src/routes/*.ts"],
}

const swaggerSpec = swaggerJSDoc(options)

require("swagger-model-validator")(swaggerSpec)

router.get("/json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerSpec)
})

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// export function validateModel(name: string, model: unknown): void {
//   // @ts-ignore
//   const responseValidation = swaggerSpec.validateModel(name, model, false, true)
//   if (!responseValidation.valid) {
//     throw new Error("Model doesn't match Swagger contract")
//   }
// }

export default router
