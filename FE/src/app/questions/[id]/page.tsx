import { use } from 'react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function QnADetailPage({ params }: Props) {
  // TODO: params.id를 이용해 데이터 fetch.
  //  tip: useEffect 대신 "use" 사용하면 편함.
  const { id } = use(params);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">질문 상세 페이지</h1>
      <p>현재 보고 있는 질문 ID: {id}</p>
    </div>
  );
}
