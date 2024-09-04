import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChatbotAsync } from '../../store/chatbotsSlice';
import { fetchAgents } from '../../store/agentsSlice';
import { RootState, AppDispatch } from '../../store';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-hot-toast';

interface ChatbotFormProps {
  onClose: () => void;
}

const ChatbotForm: React.FC<ChatbotFormProps> = ({ onClose }) => {
  const [name, setName] = useState('');
  const [agentId, setAgentId] = useState('');
  const [description, setDescription] = useState('');
  const [appearance, setAppearance] = useState({ color: '#000000', font: 'arial', size: '16' });
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.uid);
  const { agents, status, error } = useSelector((state: RootState) => state.agents);

  useEffect(() => {
    if (userId && status === 'idle') {
      dispatch(fetchAgents(userId));
    }
  }, [userId, status, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
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
    dispatch(addChatbotAsync({
      name: name.trim(), 
      agentId, 
      description: description.trim(), 
      appearance,
      ownerId: userId
    }));
    onClose();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Create New Chatbot</CardTitle>
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
          {status === 'loading' && <p>Loading agents...</p>}
          {status === 'failed' && <p>Error: {error}</p>}
          {status === 'succeeded' && (
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
          )}
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
        <Button onClick={handleSubmit} disabled={!agentId || status !== 'succeeded'}>Create Chatbot</Button>
      </CardFooter>
    </Card>
  );
};

export default ChatbotForm;
