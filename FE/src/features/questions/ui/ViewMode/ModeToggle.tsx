'use client';
import type { PreviewMode as Mode } from '../Form/QuestionModeButton';
import ModeButton, { MODES } from '../Form/QuestionModeButton';

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {MODES.map(({ label, value }) => (
        <ModeButton
          key={value}
          label={label}
          value={value}
          mode={mode}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
