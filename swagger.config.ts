export default {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Tips and tricks API - Swagger",
            version: "0.1.0",
            prefix: "/api",
            contact: {
                name: "Tips and tricks",
                url: "https://tips-and-tricks.eu",
                email: "contact@tipsandtricks.com",
            },
        },
    },
    apis: ["./src/**/*.ts"],
};