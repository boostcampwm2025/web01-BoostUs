import { render, screen } from '@testing-library/react';

describe('Vitest 설정 테스트', () => {
  it('1 + 1은 2여야 한다 (기본 동작 확인)', () => {
    expect(1 + 1).toBe(2);
  });

  it('DOM 요소가 정상적으로 렌더링 되어야 한다 (React Testing Library 확인)', () => {
    render(<div>Hello Vitest!</div>);

    const element = screen.getByText('Hello Vitest!');

    expect(element).toBeInTheDocument();
  });
});
