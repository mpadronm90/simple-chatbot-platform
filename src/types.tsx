export interface Message {
  timestamp: number;
  sender: "user" | "bot";
  content: string;
}

export interface Thread {
  id: string;
  messages: Message[];
  userId: string;
  chatbotId: string;
}
