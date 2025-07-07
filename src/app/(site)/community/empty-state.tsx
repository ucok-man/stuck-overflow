import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="font-paragraph-regular text-dark-200_light-800 mx-auto max-w-4xl text-center">
      <p>No users yet</p>
      <Link href="/sign-up" className="mt-2 font-bold text-blue-400">
        Join to be the first!
      </Link>
    </div>
  );
}
