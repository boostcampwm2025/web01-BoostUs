import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ComponentPropsWithRef } from 'react';

type CodeComponentProps = ComponentPropsWithRef<'code'> & {
  node?: unknown; // react-markdown이 주입하는 메타데이터 (사용하지 않음)
};

export const MarkdownViewer = ({ content }: { content: string }) => {
  return (
    <div className="w-full wrap-break-word overflow-x-hidden **:max-w-full **:wrap-break-word [&_pre]:overflow-x-auto [&_code]:wrap-break-word">
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
              className="text-neutral-text-default text-display-32 mb-6 mt-8"
              {...props}
            />
          ),

          // ## (h2) 스타일
          h2: ({ ...props }) => (
            <h2
              className="text-neutral-text-default text-display-24 mb-3 mt-6"
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
            <div
              className="text-body-16 text-neutral-text-default mb-4 leading-relaxed wrap-break-word"
              {...props}
            />
          ),

          // 리스트 (ul, ol, li) 스타일
          ul: ({ ...props }) => (
            <ul
              className="text-neutral-text-default text-body-16 mb-4 ml-4 list-outside list-disc"
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
              className="text-neutral-text-default border-brand-border-default bg-neutral-surface-strong my-4 border-l-4 py-4 px-6"
              {...props}
            />
          ),

          // 링크 (a) 스타일
          a: ({ ...props }) => (
            <a
              className="text-brand-dark  text-string-16 hover:text-display-16 hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          // 이미지 (img) 스타일
          img: (props) => (
            <img
              className="mx-auto my-8 block h-auto max-w-full"
              {...props}
              alt=""
            />
          ),

          // 인라인 코드 (`code`) 및 코드 블록 스타일
          code: ({
            className,
            children,
            ref,
            node: _node,
            ...rest
          }: CodeComponentProps) => {
            // 1. 언어 감지 (기존 로직)
            const match = /language-(\w+)/.exec(className ?? '');

            const isStringContent = typeof children === 'string';

            // 2. [추가] 내용에 줄바꿈이 있는지 확인
            const hasNewLine = isStringContent
              ? children.includes('\n')
              : false;

            // 3. [수정] 언어 클래스가 있거나, 줄바꿈이 있으면 '블록'으로 간주
            const isBlock = match ?? hasNewLine;

            return isBlock ? (
              // 블록형 코드 (SyntaxHighlighter)
              <SyntaxHighlighter
                {...rest}
                style={vscDarkPlus}
                // 언어가 감지되지 않았으면 'text'(일반 텍스트)로 설정하여 에러 방지
                language={match ? match[1] : 'text'}
                PreTag="div"
                className="rounded-lg my-4 text-body-14"
              >
                {isStringContent
                  ? children.replace(/\n$/, '')
                  : String(children)}
              </SyntaxHighlighter>
            ) : (
              // 인라인 코드 (기존 스타일)
              <code
                ref={ref}
                className="text-neutral-text-strong bg-neutral-border-default rounded px-1 py-0.5 font-mono text-body-14"
                {...rest}
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

          // 테이블 (table, thead, tbody, tr, th, td) 스타일
          table: ({ ...props }) => (
            <div className="my-4 w-full overflow-x-auto">
              <table
                className="w-full border-collapse border border-neutral-border-default"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-neutral-surface-strong" {...props} />
          ),
          tbody: ({ ...props }) => <tbody {...props} />,
          tr: ({ ...props }) => (
            <tr className="border-b border-neutral-border-default" {...props} />
          ),
          th: ({ ...props }) => (
            <th
              className="border border-neutral-border-default px-4 py-2 text-left text-display-16 wrap-break-word"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td
              className="border border-neutral-border-default px-4 py-2 wrap-break-word"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
