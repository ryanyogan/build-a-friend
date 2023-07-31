import SearchInput from "@/components/inputs/search-input";
import Categories from "@/components/list-views/categories";
import { db } from "@/lib/prisma";

export default async function RootPage() {
  const categories = await db.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
    </div>
  );
}
