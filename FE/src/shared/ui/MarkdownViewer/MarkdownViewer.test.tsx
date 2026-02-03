import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MarkdownViewer } from './MarkdownViewer';

// SyntaxHighlighterProps 인터페이스 정의
interface SyntaxHighlighterProps {
  children: React.ReactNode;
  language?: string;
  className?: string;
  [key: string]: unknown;
}

// SyntaxHighlighter 모킹 (성능 최적화 및 에러 방지)
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, language, className }: SyntaxHighlighterProps) => (
    <div
      data-testid="syntax-highlighter"
      data-language={language}
      className={className}
    >
      {children}
    </div>
  ),
}));

describe('MarkdownViewer Component', () => {
  it('헤더(H1, H2, H3)가 올바른 스타일로 렌더링되어야 한다', () => {
    const markdown = `
# 제목1
## 제목2
### 제목3
    `;
    render(<MarkdownViewer content={markdown} />);

    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });
    const h3 = screen.getByRole('heading', { level: 3 });

    expect(h1).toHaveTextContent('제목1');
    expect(h1).toHaveClass('text-display-32');

    expect(h2).toHaveTextContent('제목2');
    expect(h2).toHaveClass('text-display-24');

    expect(h3).toHaveTextContent('제목3');
    expect(h3).toHaveClass('text-display-20');
  });

  it('일반 텍스트(p)와 볼드체(strong)가 렌더링되어야 한다', () => {
    const markdown = '이것은 **중요한** 텍스트입니다.';
    render(<MarkdownViewer content={markdown} />);

    const paragraph = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === 'div' && // 'p' -> 'div'로 변경
        content.includes('이것은')
      );
    });
    const bold = screen.getByText('중요한');

    expect(paragraph).toHaveClass('text-body-16');
    expect(bold).toHaveClass('text-display-16');
  });

  // it('커스텀 이미지 문법([##Image|...##])이 img 태그로 변환되어야 한다', () => {
  //   // Regex 로직상 2번째 파이프(|)값이 alt가 됩니다.
  //   // 문법: [##Image|경로|ALT값|...]
  //   const markdown = `[##Image|kage@test/image.png|MyCustomAlt|1.3|{"width":100}##]`;
  //   render(<MarkdownViewer content={markdown} />);
  //
  //   // 컴포넌트에서 alt=""를 지웠으므로 이제 role="img"와 name으로 찾을 수 있습니다.
  //   const img = screen.getByRole('img', { name: 'MyCustomAlt' });
  //
  //   expect(img).toHaveAttribute(
  //     'src',
  //     'https://blog.kakaocdn.net/dn/kage@test/image.png'
  //   );
  //   expect(img).toHaveClass('custom-legacy-image');
  // });

  it('일반 마크다운 이미지도 정상적으로 렌더링되어야 한다', () => {
    const markdown = `![대체 텍스트](https://example.com/image.png)`;
    render(<MarkdownViewer content={markdown} />);

    const img = screen.getByRole('img', { name: '대체 텍스트' });

    expect(img).toHaveAttribute('src', 'https://example.com/image.png');
    expect(img).toHaveClass('mx-auto my-8');
  });

  it('코드 블록(```)이 SyntaxHighlighter로 렌더링되어야 한다', () => {
    const markdown = `
\`\`\`javascript
console.log('Hello');
\`\`\`
    `;
    render(<MarkdownViewer content={markdown} />);

    const codeBlock = screen.getByTestId('syntax-highlighter');

    expect(codeBlock).toHaveTextContent("console.log('Hello');");
    expect(codeBlock).toHaveAttribute('data-language', 'javascript');
  });

  it('인라인 코드(`)는 일반 code 태그로 렌더링되어야 한다', () => {
    const markdown = '변수 `const a = 1`을 선언하세요.';
    render(<MarkdownViewer content={markdown} />);

    const inlineCode = screen.getByText('const a = 1');

    expect(inlineCode.tagName).toBe('CODE');
    expect(inlineCode).toHaveClass(
      'text-neutral-text-strong bg-neutral-border-default'
    );
    expect(inlineCode).not.toHaveAttribute('data-testid', 'syntax-highlighter');
  });

  it('외부 링크는 새 탭(target="_blank")에서 열려야 한다', () => {
    const markdown = '[구글](https://google.com)';
    render(<MarkdownViewer content={markdown} />);

    const link = screen.getByRole('link', { name: '구글' });

    expect(link).toHaveAttribute('href', 'https://google.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('인용문(blockquote) 스타일이 적용되어야 한다', () => {
    const markdown = '> 이것은 인용입니다.';
    render(<MarkdownViewer content={markdown} />);

    const quoteText = screen.getByText('이것은 인용입니다.');
    const blockquote = quoteText.closest('blockquote');

    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveClass('border-brand-border-default border-l-4');
  });
});
