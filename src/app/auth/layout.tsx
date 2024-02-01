import { Card } from "@nextui-org/react";
import { type ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-[80vh] flex-col items-center justify-center">
      <Card className="w-96 gap-y-6 p-6">{children}</Card>
    </main>
  );
}
