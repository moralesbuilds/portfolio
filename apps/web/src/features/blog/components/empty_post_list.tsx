import { PageIcon } from "@/components/icons";

type EmptyPostList = {
  title: string;
  description: string;
};

export function EmptyPostList({ title, description }: EmptyPostList) {
  return (
    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
      {/* Icon placeholder */}
      <div className="p-3 bg-gray-100 rounded-full text-gray-400 mb-4">
        <PageIcon />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mb-6">
        {description}
      </p>
    </div>
  );
}
