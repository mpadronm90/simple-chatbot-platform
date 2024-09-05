"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function Home() {
  const [chatbotId, setChatbotId] = useState('');
  const router = useRouter();

  const handleGoToChat = () => {
    if (chatbotId.trim()) {
      router.push(`/chatbot?id=${chatbotId}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Simple Chatbot Platform</CardTitle>
          <CardDescription>Interact with chatbots and manage them.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            value={chatbotId}
            onChange={(e) => setChatbotId(e.target.value)}
            placeholder="Enter Chatbot ID"
          />
          <Button onClick={handleGoToChat} className="w-full">
            Go to Chat
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/admin" className="w-full">
            <Button variant="outline" className="w-full">Admin Panel</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
