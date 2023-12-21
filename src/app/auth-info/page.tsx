import { auth } from "auth";

export default async function AuthInfo() {
  const session = await auth();
  return <div>{JSON.stringify(session)}</div>;
}
