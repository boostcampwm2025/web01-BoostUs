import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

export const MarkdownViewer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        [
          rehypeSanitize,
          {
            ...defaultSchema,
            attributes: {
              ...defaultSchema.attributes,
              p: [
                ...(defaultSchema.attributes?.p ?? []),
                ['align', 'center', 'left', 'right', 'justify'],
              ],
              img: [
                ...(defaultSchema.attributes?.img ?? []),
                'width',
                'height',
                'align',
              ],
              // 중요: code 태그에서 className을 허용해야 언어 감지가 가능합니다.
              code: [...(defaultSchema.attributes?.code ?? []), 'className'],
            },
          },
        ],
      ]}
      components={{
        /**
         * 요소별 스타일 커스텀
         * 각 키(h1, h2, p 등)는 마크다운 요소에 대응됩니다.
         */

        // # (h1) 스타일
        h1: ({ ...props }) => (
          <h1
            className="text-neutral-text-default text-display-32 mb-6"
            {...props}
          />
        ),

        // ## (h2) 스타일
        h2: ({ ...props }) => (
          <h2
            className="text-neutral-text-default text-display-24 mb-3"
            {...props}
          />
        ),

        // ### (h3) 스타일
        h3: ({ ...props }) => (
          <h3
            className="text-neutral-text-default text-display-20 mb-3"
            {...props}
          />
        ),

        // 본문 텍스트 (p) 스타일
        p: ({ ...props }) => (
          <p
            className="text-body-16 text-neutral-text-default mb-4 leading-relaxed"
            {...props}
          />
        ),

        // 리스트 (ul, ol, li) 스타일
        ul: ({ ...props }) => (
          <ul
            className="text-neutral-text-default text-body-16 mb-4 ml-4 list-inside list-disc"
            {...props}
          />
        ),
        ol: ({ ...props }) => (
          <ol
            className="text-neutral-text-default text-body-16 mb-4 ml-4 list-inside list-decimal"
            {...props}
          />
        ),
        li: ({ ...props }) => <li className="mb-1" {...props} />,

        // 인용문 (blockquote) 스타일
        blockquote: ({ ...props }) => (
          <blockquote
            className="text-neutral-text-default border-accent-blue bg-grayscale-300 my-4 border-l-4 py-1 pl-4"
            {...props}
          />
        ),

        // 링크 (a) 스타일
        a: ({ ...props }) => (
          <a
            className="text-accent-blue hover:text-accent-blue text-string-16 hover:text-display-16 transition-colors hover:underline"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),

        // 이미지 (img) 스타일
        img: ({ ...props }) => <img className="mb-8" {...props} />,

        // 인라인 코드 (`code`) 및 코드 블록 스타일
        code: ({ className, children, ...props }) => {
          // 인라인 코드인지 블록 코드인지 구분 (간단한 예시)
          const isInline = !className;
          return isInline ? (
            <code
              className="text-neutral-text-strong bg-grayscale-300 rounded px-1 py-0.5 font-mono text-sm"
              {...props}
            >
              {children}
            </code>
          ) : (
            <code
              className={`bg-grayscale-300 text-neutral-text-default my-4 block w-full overflow-x-auto rounded-lg p-4 text-sm ${className}`}
              {...props}
            >
              {children}
            </code>
          );
        },

        pre: ({ ...props }) => (
          <pre className="m-0 w-full bg-transparent p-0" {...props} />
        ),

        // 볼드체 (strong, b) 스타일
        strong: ({ ...props }) => (
          <strong className="text-display-16" {...props} />
        ),
        b: ({ ...props }) => <b className="text-display-16" {...props} />,
        h5: ({ ...props }) => <b className="text-display-16" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
