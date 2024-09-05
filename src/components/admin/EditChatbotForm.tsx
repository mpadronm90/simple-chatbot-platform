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
}

interface ChatbotHistoryEntry {
  previousConfig: Chatbot;
  updatedConfig: Chatbot;
  timestamp: number;
}

const EditChatbotForm: React.FC<EditChatbotFormProps> = ({ chatbot, onClose }) => {
  const [name, setName] = useState(chatbot.name);
  const [agentId, setAgentId] = useState(chatbot.agentId);
  const [description, setDescription] = useState(chatbot.description);
  const [appearance, setAppearance] = useState(chatbot.appearance);
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);
  const [key, setKey] = useState(0);
  const [chatbotHistory, setChatbotHistory] = useState<ChatbotHistoryEntry[]>([]);
  
  const dispatch = useDispatch<AppDispatch>();
  const agents = useSelector((state: RootState) => state.agents.agents);

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
      setKey(prevKey => prevKey + 1);
      
      // Add to history only if it's not a new chatbot
      if (chatbotHistory.length > 0) {
        setChatbotHistory(prevHistory => [
          {
            previousConfig: chatbot,
            updatedConfig: updatedChatbot,
            timestamp: Date.now()
          },
          ...prevHistory
        ]);
      }
    }).catch((error) => {
      toast.error(`Failed to update chatbot: ${error.message}`);
    });
  }, [dispatch, chatbot, name, agentId, description, appearance, chatbotHistory]);

  const handleRollback = useCallback(() => {
    if (chatbotHistory.length > 0) {
      const lastEntry = chatbotHistory[0];
      const rollbackChatbot = {
        ...chatbot,
        name: lastEntry.previousConfig.name,
        agentId: lastEntry.previousConfig.agentId,
        description: lastEntry.previousConfig.description,
        appearance: lastEntry.previousConfig.appearance
      };

      dispatch(updateChatbotAsync(rollbackChatbot)).then(() => {
        setName(rollbackChatbot.name);
        setAgentId(rollbackChatbot.agentId);
        setDescription(rollbackChatbot.description);
        setAppearance(rollbackChatbot.appearance);
        
        // Remove the last entry from history
        setChatbotHistory(prevHistory => prevHistory.slice(1));
        
        // Increment the key to force re-render of the ChatbotComponent
        setKey(prevKey => prevKey + 1);
        
        toast.success('Rolled back to previous configuration');
      }).catch((error) => {
        toast.error(`Failed to rollback chatbot: ${error.message}`);
      });
    } else {
      toast.error('No previous configuration available');
    }
  }, [chatbot, chatbotHistory, dispatch]);

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
            <Button variant="outline" onClick={handleRollback} disabled={chatbotHistory.length === 0}>
              <ResetIcon className="mr-2 h-4 w-4" />
              Rollback
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
