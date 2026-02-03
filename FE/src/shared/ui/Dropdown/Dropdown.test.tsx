import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import type { Mock } from 'vitest'; // 타입 import 추가
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from './index';

// 1. Framer Motion 모킹 (타입 구체화)
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: {
    div: ({
      children,
      className,
      onClick,
      ...props
    }: React.ComponentProps<'div'>) => (
      <div className={className} onClick={onClick} {...props}>
        {children}
      </div>
    ),
  },
}));

// 2. Lucide 아이콘 모킹
vi.mock('lucide-react', () => ({
  ChevronDown: () => <span data-testid="icon-chevron-down" />,
  Circle: () => <span data-testid="icon-circle" />,
  CircleCheck: () => <span data-testid="icon-circle-check" />,
}));

describe('Dropdown Component', () => {
  // TestComponent Props 타입 명시
  interface TestComponentProps {
    onSelectMock?: Mock; // 또는 (val: string) => void
  }

  const TestComponent = ({ onSelectMock = vi.fn() }: TestComponentProps) => (
    <Dropdown>
      <DropdownTrigger label="옵션 선택" />
      <DropdownContent>
        <DropdownItem label="아이템 1" onClick={() => onSelectMock('1')} />
        <DropdownItem
          label="아이템 2"
          isSelected={true}
          onClick={() => onSelectMock('2')}
        />
      </DropdownContent>
    </Dropdown>
  );

  it('초기 상태에서는 컨텐츠(패널)가 보이지 않아야 한다', () => {
    render(<TestComponent />);

    expect(screen.getByText('옵션 선택')).toBeInTheDocument();
    expect(screen.queryByText('아이템 1')).not.toBeInTheDocument();
  });

  it('Trigger를 클릭하면 드롭다운이 열려야 한다', () => {
    render(<TestComponent />);

    const trigger = screen.getByText('옵션 선택');
    fireEvent.click(trigger);

    expect(screen.getByText('아이템 1')).toBeInTheDocument();
    expect(screen.getByText('아이템 2')).toBeInTheDocument();
  });

  it('열린 상태에서 Trigger를 다시 클릭하면 닫혀야 한다', () => {
    render(<TestComponent />);
    const trigger = screen.getByText('옵션 선택');

    fireEvent.click(trigger);
    expect(screen.getByText('아이템 1')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByText('아이템 1')).not.toBeInTheDocument();
  });

  it('DropdownItem을 클릭하면 onClick이 실행되고 드롭다운이 닫혀야 한다', () => {
    const mockFn = vi.fn();
    render(<TestComponent onSelectMock={mockFn} />);

    fireEvent.click(screen.getByText('옵션 선택'));

    const item = screen.getByText('아이템 1');
    fireEvent.click(item);

    expect(mockFn).toHaveBeenCalledWith('1');
    expect(screen.queryByText('아이템 1')).not.toBeInTheDocument();
  });

  it('isSelected 프롭에 따라 체크 아이콘이 다르게 보여야 한다', () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByText('옵션 선택'));

    const item1 = screen.getByText('아이템 1').closest('button');
    const item2 = screen.getByText('아이템 2').closest('button');

    expect(item1).toContainHTML('data-testid="icon-circle"');
    expect(item2).toContainHTML('data-testid="icon-circle-check"');
  });

  it('외부 영역(Outside)을 클릭하면 드롭다운이 닫혀야 한다', () => {
    render(
      <div>
        <span data-testid="outside">바깥 세상</span>
        <TestComponent />
      </div>
    );

    fireEvent.click(screen.getByText('옵션 선택'));
    expect(screen.getByText('아이템 1')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(screen.queryByText('아이템 1')).not.toBeInTheDocument();
  });
});
