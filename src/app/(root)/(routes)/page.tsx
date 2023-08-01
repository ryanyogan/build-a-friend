import SearchInput from "@/components/inputs/search-input";
import Categories from "@/components/list-views/categories";
import Friends from "@/components/list-views/friends";
import { db } from "@/lib/prisma";

interface RootPageProps {
  searchParams: {
    categoryId: string;
    name: string;
  };
}

export default async function RootPage({ searchParams }: RootPageProps) {
  const friends = await db.friend.findMany({
    where: {
      categoryId: searchParams.categoryId,
      name: {
        search: searchParams.name,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          messages: true,
        },
      },
    },
  });

  const categories = await db.category.findMany();

  return (
    <div className="h-full p-4 space-y-2">
      <SearchInput />
      <Categories data={categories} />
      <Friends friends={friends} />
    </div>
  );
}
