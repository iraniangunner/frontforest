import { marked } from "marked";

interface Props {
  excerpt: string | null;
  body: string;
}

export default function PostBody({ excerpt, body }: Props) {
  const html = marked(body) as string;

  return (
    <>
      {excerpt && (
        <p className="text-gray-600 text-lg leading-relaxed mb-8 pb-8 border-b border-gray-200 font-medium">
          {excerpt}
        </p>
      )}
      <div
        className="text-gray-700 text-base leading-loose mb-10
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-gray-900 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-gray-200
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-gray-900
          [&_p]:mb-4 [&_p]:leading-loose
          [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:mb-4 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:mb-4 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_a]:text-teal-600 [&_a]:underline [&_a:hover]:text-teal-700
          [&_strong]:font-bold [&_strong]:text-gray-900
          [&_em]:italic [&_u]:underline [&_s]:line-through
          [&_blockquote]:border-r-4 [&_blockquote]:border-teal-400 [&_blockquote]:pr-5 [&_blockquote]:py-1 [&_blockquote]:text-gray-600 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-teal-50 [&_blockquote]:rounded-l-xl
          [&_hr]:border-gray-200 [&_hr]:my-8
          [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6
          [&_th]:bg-gray-100 [&_th]:text-right [&_th]:p-3 [&_th]:border [&_th]:border-gray-200 [&_th]:font-bold
          [&_td]:p-3 [&_td]:border [&_td]:border-gray-200"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
