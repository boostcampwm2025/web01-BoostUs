import { renderHook, act } from '@testing-library/react';
import useImageError from './useImageError';

describe('useImageError Hook', () => {
  // 1. 초기 상태 테스트
  it('초기 에러 상태는 false여야 한다', () => {
    const { result } = renderHook(() => useImageError('image1.jpg'));
    expect(result.current.isError).toBe(false);
  });

  // 2. 상태 변경 테스트
  it('setIsError를 호출하면 에러 상태가 true로 변경되어야 한다', () => {
    const { result } = renderHook(() => useImageError('image1.jpg'));
    act(() => {
      result.current.setIsError(true);
    });
    expect(result.current.isError).toBe(true);
  });

  // 3. 핵심 로직 테스트 (URL 변경 시 초기화)
  it('imageUrl이 변경되면 에러 상태가 false로 초기화되어야 한다', () => {
    const { result, rerender } = renderHook((url) => useImageError(url), {
      initialProps: 'image1.jpg',
    });

    act(() => {
      result.current.setIsError(true);
    });
    expect(result.current.isError).toBe(true);
    rerender('image2.jpg');
    expect(result.current.isError).toBe(false);
  });
});
