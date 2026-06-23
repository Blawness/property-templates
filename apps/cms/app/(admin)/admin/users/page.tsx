import { UsersScreen } from "@blawness/admin-kit/screens/users";

export default async function UsersPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  return <UsersScreen searchParams={searchParams} />;
}
