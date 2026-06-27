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
        <p className="text-[#656565] text-lg leading-relaxed mb-8 pb-8 border-b border-[#F0F0F0] font-medium">
          {excerpt}
        </p>
      )}
      <div
        className="text-[#444444] text-base leading-loose mb-10
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-[#242424] [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-[#F0F0F0]
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-[#242424]
          [&_p]:mb-4 [&_p]:leading-loose
          [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:mb-4 [&_ul]:space-y-1
          [&_ol]:list-decimal [&_ol]:pr-6 [&_ol]:mb-4 [&_ol]:space-y-1
          [&_li]:leading-relaxed
          [&_a]:text-[#A72F3B] [&_a]:underline [&_a:hover]:text-[#86262F]
          [&_strong]:font-bold [&_strong]:text-[#242424]
          [&_em]:italic [&_u]:underline [&_s]:line-through
          [&_blockquote]:border-r-4 [&_blockquote]:border-[#DCACB1] [&_blockquote]:pr-5 [&_blockquote]:py-1 [&_blockquote]:text-[#656565] [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:bg-[#FBF3F4] [&_blockquote]:rounded-l-xl
          [&_hr]:border-[#F0F0F0] [&_hr]:my-8
          [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6
          [&_th]:bg-[#FAFAFA] [&_th]:text-right [&_th]:p-3 [&_th]:border [&_th]:border-[#F0F0F0] [&_th]:font-bold
          [&_td]:p-3 [&_td]:border [&_td]:border-[#F0F0F0]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
