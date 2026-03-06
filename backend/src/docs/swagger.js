import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const buildServerUrl = () => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }

  const port = Number(process.env.PORT) || 5000;
  return `http://localhost:${port}`;
};

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "UNISALE Marketplace API",
    version: "1.0.0",
    description:
      "Backend API documentation for UNISALE, a college marketplace where students buy and sell products.",
  },
  servers: [
    {
      url: buildServerUrl(),
      description: "Configured API server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Health and status endpoints",
    },
    {
      name: "Users",
      description: "Authentication and user profile",
    },
    {
      name: "Products",
      description: "Marketplace product listing operations",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "65f9f23d5ce9a77f92e68a6a" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john@college.edu" },
          avatar: {
            type: "string",
            example: "https://res.cloudinary.com/demo/image/upload/avatar.jpg",
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ProductImage: {
        type: "object",
        properties: {
          url: { type: "string", example: "https://res.cloudinary.com/demo/image/upload/p1.jpg" },
          publicId: { type: "string", example: "unisale/products/abc123" },
        },
      },
      Product: {
        type: "object",
        properties: {
          _id: { type: "string", example: "65f9f23d5ce9a77f92e68a6b" },
          title: { type: "string", example: "Used Engineering Calculator" },
          description: { type: "string", example: "Casio calculator in good condition." },
          price: { type: "number", example: 1200 },
          category: { type: "string", example: "Electronics" },
          images: {
            type: "array",
            items: { $ref: "#/components/schemas/ProductImage" },
          },
          seller: {
            oneOf: [
              { type: "string", example: "65f9f23d5ce9a77f92e68a6a" },
              { $ref: "#/components/schemas/User" },
            ],
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Invalid or expired token." },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "UNISALE API is running" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/register": {
      post: {
        tags: ["Users"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "John Doe" },
                  email: { type: "string", format: "email", example: "john@college.edu" },
                  password: { type: "string", format: "password", example: "password123" },
                  avatar: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User registered",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "User registered successfully." },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        token: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          409: {
            description: "Email already exists",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/users/login": {
      post: {
        tags: ["Users"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "john@college.edu" },
                  password: { type: "string", format: "password", example: "password123" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Login successful." },
                    data: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                        token: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/users/logout": {
      post: {
        tags: ["Users"],
        summary: "Logout user",
        responses: {
          200: {
            description: "Logout successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Logout successful." },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/profile": {
      get: {
        tags: ["Users"],
        summary: "Get authenticated user profile",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: "Profile details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/products": {
      post: {
        tags: ["Products"],
        summary: "Create a product",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["title", "description", "price", "category", "images"],
                properties: {
                  title: { type: "string", example: "Used Laptop" },
                  description: { type: "string", example: "16GB RAM, 512GB SSD" },
                  price: { type: "number", example: 35000 },
                  category: { type: "string", example: "Electronics" },
                  images: {
                    type: "array",
                    items: { type: "string", format: "binary" },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Product created successfully." },
                    data: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      get: {
        tags: ["Products"],
        summary: "Get all products",
        parameters: [
          {
            in: "query",
            name: "page",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            in: "query",
            name: "limit",
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 },
          },
          {
            in: "query",
            name: "category",
            schema: { type: "string" },
          },
          {
            in: "query",
            name: "search",
            schema: { type: "string" },
          },
          {
            in: "query",
            name: "minPrice",
            schema: { type: "number" },
          },
          {
            in: "query",
            name: "maxPrice",
            schema: { type: "number" },
          },
          {
            in: "query",
            name: "sortBy",
            schema: {
              type: "string",
              enum: ["createdAt", "price", "title"],
              default: "createdAt",
            },
          },
          {
            in: "query",
            name: "sortOrder",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
          },
        ],
        responses: {
          200: {
            description: "Products list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        products: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Product" },
                        },
                        pagination: {
                          type: "object",
                          properties: {
                            total: { type: "integer", example: 24 },
                            page: { type: "integer", example: 1 },
                            limit: { type: "integer", example: 10 },
                            pages: { type: "integer", example: 3 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by ID",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Single product details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: { $ref: "#/components/schemas/Product" },
                  },
                },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product by ID",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Product deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Product deleted successfully." },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          403: {
            description: "Forbidden",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          404: {
            description: "Product not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app) => {
  app.get("/api/docs.json", (req, res) => {
    res.status(200).json(swaggerSpec);
  });

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customSiteTitle: "UNISALE API Docs",
    })
  );
};
