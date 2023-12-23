import { auth } from "auth";

export default auth;

export const config = { matcher: ["/recipe/create", "/recipe/:id/edit"] };
