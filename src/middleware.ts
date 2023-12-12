export { default } from "next-auth/middleware";

export const config = { matcher: ["/recipe/create", "/recipe/:id/edit"] };
