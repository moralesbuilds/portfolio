import { BlogPostItem } from "@moralesbuilds/contents-db";
import PostItem from "./post_item";
import { EmptyPostList } from "./empty_post_list";

type PostListProps = {
  items?: BlogPostItem[] | null;
  readMoreLabel: string;
  emptyTitle: string;
  emptyDescritpion: string;
};

export function PostList({ items, readMoreLabel, emptyTitle, emptyDescritpion }: PostListProps) {
  const hasItems = (items?.length ?? 0) > 0;

  return (
    <div className="w-full p-6 bg-base border border-gray-200 rounded-md shadow-sm">
      {hasItems && <ul className="divide-y divide-gray-200">
        {items?.map((p) => (<PostItem
          key={p.id}
          publishedAt={p.publishedAt}
          category={p.category}
          title={p.title}
          slug={p.slug}
          summary={p.summary}
          readMoreLabel={readMoreLabel}
        />))}
      </ul>}

      {!hasItems && <EmptyPostList title={emptyTitle} description={emptyDescritpion} />}
    </div>
  );
}
