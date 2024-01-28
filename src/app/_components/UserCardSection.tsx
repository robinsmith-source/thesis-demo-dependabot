import UserCard from "~/app/_components/UserCard";
import { type User } from "@prisma/client";
import { Card } from "@nextui-org/react";

export default function UserCardSection({
  className,
  layout = "grid",
  users,
}: {
  className?: string;
  layout?: "grid" | "flex";
  users: User[];
}) {
  if (users.length === 0) {
    return (
      <section className="mx-auto">
        <h3 className="p-5 text-lg font-semibold text-warning-500">
          Friendless?
        </h3>
      </section>
    );
  }

  return (
    <section
      className={`${className} w-full place-items-center justify-center gap-8 ${
        layout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "flex flex-wrap "
      }`}
    >
      {users.map((user) => (
        <Card key={user.id} className="p-2">
          <UserCard user={user} withFollowButton={false} />
        </Card>
      ))}
    </section>
  );
}
