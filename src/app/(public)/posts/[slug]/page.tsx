import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import PostHero from "@/app/_components/posts/PostHero";
import PostMeta from "@/app/_components/posts/PostMeta";
import PostBody from "@/app/_components/posts/PostBody";
import PostComments from "@/app/_components/posts/PostComments";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getComments(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}/comments`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "مقاله | فانتوم پلاس" };

  const title = `${post.title} | اخبار و مقالات`;
  const description = post.excerpt || post.title;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: "نمایندگی انحصاری فانتوم پلاس در ایران",
      type: "article",
      locale: "fa_IR",
      images: post.thumbnail ? [{ url: post.thumbnail, alt: post.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

// Schema.org JSON-LD
function PostJsonLd({ post, slug }: { post: any; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`,
    ...(post.thumbnail && { image: post.thumbnail }),
    ...(post.published_at && { datePublished: post.published_at }),
    ...(post.updated_at && { dateModified: post.updated_at }),
    ...(post.author && {
      author: {
        "@type": "Person",
        name: post.author,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "نمایندگی انحصاری فانتوم پلاس در ایران",
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, comments] = await Promise.all([
    getPost(slug),
    getComments(slug),
  ]);

  if (!post) notFound();

  return (
    <>
      <PostJsonLd post={post} slug={slug} />
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <PostHero title={post.title} thumbnail={post.thumbnail} />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <PostMeta
            author={post.author}
            publishedAt={post.published_at}
            views={post.views}
            commentsCount={comments.length}
          />
          <PostBody excerpt={post.excerpt} body={post.body} />
          <PostComments slug={slug} comments={comments} />
          <div className="mt-8">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition group"
            >
              <HiArrowRight className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              بازگشت به اخبار
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
