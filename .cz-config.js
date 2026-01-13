module.exports = {
  types: [
    { value: "✨ feat", name: "✨ feat:     새로운 기능 추가" },
    { value: "🐛 fix", name: "🐛 fix:      버그 수정" },
    { value: "♻️ refactor", name: "♻️ refactor: 코드 리팩토링" },
    { value: "📝 docs", name: "📝 docs:     문서 추가/수정" },
    { value: "⚡ perf", name: "⚡ perf:     성능 개선" },
    { value: "🔧 chore", name: "🔧 chore:    설정 파일 수정" },
    { value: "🚀 deploy", name: "🚀 deploy:   배포 관련" },
    { value: "🔥 remove", name: "🔥 remove:   코드/파일 삭제" },
    { value: "💄 style", name: "💄 style:    UI/CSS 파일 추가/수정" },
    { value: "🧪 test", name: "🧪 test:     테스트 코드 추가/수정" },
  ],
  messages: {
    type: "커밋 타입을 선택하세요:",
    // scope: "\n커밋의 범위(scope)를 입력하세요 (선택 사항):",
    // customScope: "커밋의 범위(scope)를 직접 입력하세요:",
    subject: "커밋 제목을 입력하세요 (짧고 간결하게):",
    body: '커밋 본문을 입력하세요 (줄바꿈은 "|" 사용, 선택 사항):\n',
    // breaking: "Breaking Changes가 있다면 입력하세요 (선택 사항):\n",
    // footer: "해결된 이슈가 있다면 입력하세요 (예: #123, 선택 사항):\n",
    customScope: "커밋의 범위(scope)를 직접 입력하세요:",
    subject: "커밋 제목을 입력하세요 (짧고 간결하게):",
    body: '커밋 본문을 입력하세요 (줄바꿈은 "|" 사용, 선택 사항):\n',
    footer: "해결된 이슈가 있다면 입력하세요 (예: #123, 선택 사항):\n",

    confirmCommit: "이대로 커밋하시겠습니까?",
  },
  skipQuestions: ['scope', 'customScope', 'breaking', 'footer'], // scope, breaking, footer 등 불필요한 질문은 건너뜁니다.
  subjectLimit: 100,
};
