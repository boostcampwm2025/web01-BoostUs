import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ModalOverlay from './ModalOverlay';

// 1. Next.js의 useRouter를 가짜로 만듭니다.
const backMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: backMock,
  }),
}));

// 2. CloseIcon 컴포넌트도 가짜로 만듭니다 (아이콘 렌더링 세부사항은 테스트 불필요)
vi.mock('@/components/ui/CloseIcon', () => ({
  default: () => <svg data-testid="close-icon" />,
}));

describe('ModalOverlay Component', () => {
  // 각 테스트 실행 전에 모의 함수(mock)를 초기화합니다.
  beforeEach(() => {
    backMock.mockClear();
    // body 스타일 초기화
    document.body.style.overflow = '';
  });

  // 테스트 종료 후 정리
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('자식 요소(Content)가 정상적으로 렌더링되어야 한다', () => {
    render(
      <ModalOverlay>
        <div>테스트 컨텐츠</div>
      </ModalOverlay>
    );

    expect(screen.getByText('테스트 컨텐츠')).toBeInTheDocument();
  });

  it('마운트 시 body 스크롤이 잠기고(hidden), 언마운트 시 풀려야 한다', () => {
    const { unmount } = render(
      <ModalOverlay>
        <div>컨텐츠</div>
      </ModalOverlay>
    );

    // 1. 마운트 직후 overflow 확인
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');

    // 2. 컴포넌트 제거 (언마운트)
    unmount();

    // 3. 원래대로 돌아왔는지 확인
    expect(document.body.style.overflow).toBe('');
  });

  it('닫기(X) 버튼을 클릭하면 router.back()이 호출되어야 한다', () => {
    render(
      <ModalOverlay>
        <div>컨텐츠</div>
      </ModalOverlay>
    );

    // aria-label="닫기" 를 통해 버튼을 찾습니다.
    const closeButton = screen.getByLabelText('닫기');
    fireEvent.click(closeButton);

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  describe('배경 클릭 동작 (closeOnOutsideClick prop)', () => {
    it('기본값(false)일 때는 배경을 클릭해도 닫히지 않아야 한다', () => {
      const { container } = render(
        <ModalOverlay>
          <div>컨텐츠</div>
        </ModalOverlay>
      );

      // 배경 요소 찾기 (가장 바깥 div)
      const background = container.firstChild as HTMLElement;

      fireEvent.click(background);

      expect(backMock).not.toHaveBeenCalled();
    });

    it('true일 때는 배경을 클릭하면 닫혀야(router.back) 한다', () => {
      const { container } = render(
        <ModalOverlay closeOnOutsideClick={true}>
          <div>컨텐츠</div>
        </ModalOverlay>
      );

      const background = container.firstChild as HTMLElement;

      fireEvent.click(background);

      expect(backMock).toHaveBeenCalledTimes(1);
    });

    it('모달 내부 컨텐츠를 클릭할 때는 전파가 중단되어 닫히지 않아야 한다', () => {
      render(
        <ModalOverlay closeOnOutsideClick={true}>
          <div data-testid="inner-content">내부 컨텐츠</div>
        </ModalOverlay>
      );

      // 내부 컨텐츠 클릭
      const innerContent = screen.getByTestId('inner-content');
      fireEvent.click(innerContent);

      // 배경 클릭 옵션이 켜져있어도, 내부를 클릭했으므로 호출되면 안 됨
      expect(backMock).not.toHaveBeenCalled();
    });
  });
});
