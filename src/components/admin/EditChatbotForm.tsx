import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateChatbotAsync } from '../../store/chatbotsSlice';
import { RootState, AppDispatch } from '../../store';
import { Chatbot } from '../../store/chatbotsSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'react-hot-toast';
import ChatbotComponent from '../chatbot/Chatbot';
import { ResetIcon } from '@radix-ui/react-icons';

interface EditChatbotFormProps {
  chatbot: Chatbot;
  onClose: () => void;
  onUpdate: (updatedChatbot: Chatbot) => void;
}

interface ChatbotHistoryEntry {
  previousConfig: Chatbot;
  timestamp: number;
}

const EditChatbotForm: React.FC<EditChatbotFormProps> = ({ chatbot, onClose, onUpdate }) => {
  const [name, setName] = useState(chatbot.name);
  const [agentId, setAgentId] = useState(chatbot.agentId);
  const [description, setDescription] = useState(chatbot.description);
  const [appearance, setAppearance] = useState(chatbot.appearance);
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const [key, setKey] = useState(0);
  const [chatbotHistory, setChatbotHistory] = useState<ChatbotHistoryEntry[]>([]);
  const [historyCount, setHistoryCount] = useState(1);
  
  const dispatch = useDispatch<AppDispatch>();
  const agents = useSelector((state: RootState) => state.agents.agents);

  useEffect(() => {
    console.log('Chatbot history updated:', chatbotHistory);
    setHistoryCount(chatbotHistory.length);
  }, [chatbotHistory]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Chatbot name is required.');
      return;
    }
    if (name.length > 20) {
      toast.error('Chatbot name must be 20 characters or less.');
      return;
    }
    if (!agentId) {
      toast.error('Please select an agent for the chatbot.');
      return;
    }
    if (description.length > 500) {
      toast.error('Description must be 500 characters or less.');
      return;
    }
    const updatedChatbot = {
      ...chatbot,
      name: name.trim(),
      agentId,
      description: description.trim(),
      appearance
    };

    dispatch(updateChatbotAsync(updatedChatbot)).then(() => {
      toast.success('Chatbot updated successfully');
      
      setChatbotHistory(prevHistory => {
        console.log('Previous history:', prevHistory);
        const newEntry = {
          previousConfig: chatbot,
          timestamp: Date.now()
        };
        return [newEntry, ...prevHistory];
      });

      onUpdate(updatedChatbot);  // Call onUpdate with the updated chatbot
      setKey(prevKey => prevKey + 1);
    }).catch((error) => {
      toast.error(`Failed to update chatbot: ${error.message}`);
    });
  }, [dispatch, chatbot, name, agentId, description, appearance, onUpdate]);

  const handleRollback = useCallback(() => {
    console.log('Attempting rollback. History length:', chatbotHistory.length);
    if (chatbotHistory.length > 0) {
      const previousEntry = chatbotHistory[0];
      console.log('History here', previousEntry);
      const rollbackChatbot = previousEntry.previousConfig;

      console.log('Rolling back to:', rollbackChatbot);

      setName(rollbackChatbot.name);
      setAgentId(rollbackChatbot.agentId);
      setDescription(rollbackChatbot.description);
      setAppearance(rollbackChatbot.appearance);
      
      setChatbotHistory(prevHistory => {
        const newHistory = prevHistory.slice(1);
        console.log('New history after rollback:', newHistory);
        return newHistory;
      });
      setKey(prevKey => prevKey + 1);
      
      toast.success('Rolled back to previous configuration');
      
      dispatch(updateChatbotAsync(rollbackChatbot)).catch((error) => {
        toast.error(`Failed to update chatbot in store: ${error.message}`);
      });
    } else {
      console.log('No previous configuration available');
      toast.error('No previous configuration available');
    }
  }, [chatbotHistory, dispatch]);

  return (
    <div className="flex h-full space-x-4">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Chatbot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chatbot-name">Chatbot name</Label>
            <Input
              id="chatbot-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter chatbot name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agent-select">Select an Agent</Label>
            <Select value={agentId} onValueChange={setAgentId}>
              <SelectTrigger id="agent-select">
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatbot-description">Chatbot description</Label>
            <Textarea
              id="chatbot-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter chatbot description"
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appearance Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="color-picker">Primary Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="color-picker"
                  type="color"
                  value={appearance.color}
                  onChange={(e) => setAppearance({ ...appearance, color: e.target.value })}
                  className="w-12 h-12 p-1 rounded-md"
                />
                <span>{appearance.color}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-select">Font</Label>
              <Select value={appearance.font} onValueChange={(value) => setAppearance({ ...appearance, font: value })}>
                <SelectTrigger id="font-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="helvetica">Helvetica</SelectItem>
                  <SelectItem value="times-new-roman">Times New Roman</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size: {appearance.size}px</Label>
              <Slider
                id="font-size"
                min={12}
                max={24}
                step={1}
                value={[parseInt(appearance.size)]}
                onValueChange={(value) => setAppearance({ ...appearance, size: value[0].toString() })}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRollback} 
              disabled={historyCount == 0}
            >
              <ResetIcon className="mr-2 h-4 w-4" />
              Rollback ({historyCount})
            </Button>
            <Button onClick={handleSubmit}>Update Chatbot</Button>
          </div>
        </CardFooter>
      </Card>

      <Separator orientation="vertical" />

      <div className="w-1/2 flex flex-col">
        <div className="border rounded-lg p-4 flex-grow flex items-center justify-center">
          <ChatbotComponent
            key={key}
            chatbotId={chatbot.id}
            isOpen={isChatbotOpen}
            setIsOpen={setIsChatbotOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default EditChatbotForm;
