'use client';

import Modal from '@/widgets/Modal/Modal';
import { useState } from 'react';

const BambooHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPostContent('');
  };

  const handleSubmit = () => {
    if (postContent.trim()) {
      console.log('글 작성:', postContent);
      // API 호출 또는 상태 관리 로직 추가
      closeModal();
    }
  };

  return (
    <div className="flex flex-row justify-between w-full">
      <span className="text-gray-500">
        익명으로 자유롭게 이야기를 나눠보세요
      </span>
      <button
        onClick={openModal}
        className="bg-blue-700 px-4 py-2 rounded-xl text-white cursor-pointer"
      >
        새 글 작성
      </button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800 text-xl">새 글 작성</h2>
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="익명으로 자유롭게 이야기를 나눠보세요"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full h-40 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={closeModal}
              className="hover:bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={!postContent.trim()}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 px-4 py-2 rounded-lg text-white cursor-pointer"
            >
              등록하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BambooHeader;
