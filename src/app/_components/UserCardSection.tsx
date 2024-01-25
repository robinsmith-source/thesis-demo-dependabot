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
  return (
    <>
      {users.length === 0 ? (
        <h3 className="text-warning-300">Friendless?</h3>
      ) : (
        <section
          className={`${className} w-full place-items-center justify-center gap-8 ${
            layout === "grid"
              ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-wrap "
          }`}
        >
          {users.map((user) => (
            <Card key={user.id} className="m-3 p-2">
              <UserCard user={user} withFollowButton={false} />
            </Card>
          ))}
        </section>
      )}
    </>
  );
}
