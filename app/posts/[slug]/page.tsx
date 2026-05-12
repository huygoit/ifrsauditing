import { redirect } from "next/navigation";

export default function PostRedirect({ params }: { params: { slug: string } }) {
  redirect(`/vi/posts/${params.slug}`);
}

