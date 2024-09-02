"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [chatbotId, setChatbotId] = useState('');
  const router = useRouter();

  const handleGoToChat = () => {
    if (chatbotId.trim()) {
      router.push(`/chatbot/${chatbotId}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Simple Chatbot Platform</h1>
      <p className="mb-8">This is a platform where you can interact with chatbots and manage them.</p>
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={chatbotId}
          onChange={(e) => setChatbotId(e.target.value)}
          placeholder="Enter Chatbot ID"
          className="border p-2 rounded"
        />
        <button onClick={handleGoToChat} className="bg-blue-500 text-white p-2 rounded">
          Go to Chat
        </button>
        <Link href="/admin" className="text-blue-500">
          Admin Panel
        </Link>
        <Link href="/admin/login" className="text-blue-500">
          Admin Login
        </Link>
      </div>
    </main>
  );
}
