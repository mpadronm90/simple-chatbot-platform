import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAgent } from '../../store/agentsSlice';
import { AppDispatch, RootState } from '../../store';
import { Agent } from '../../shared/api.types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditAgentFormProps {
  agent: Agent;
  onClose: () => void;
  isConnectedToChatbot: boolean;
}

const EditAgentForm: React.FC<EditAgentFormProps> = ({ agent, onClose, isConnectedToChatbot }) => {
  const [name, setName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [instructions, setInstructions] = useState(agent.instructions);
  const [model, setModel] = useState(agent.model || 'gpt-4-turbo-preview');
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!name || !name.trim()) {
      toast.error('Agent name is required.');
      return;
    }
    if (name.length > 20) {
      toast.error('Agent name must be 20 characters or less.');
      return;
    }
    if (description.length > 500) {
      toast.error('Description must be 500 characters or less.');
      return;
    }
    if (instructions.length > 500) {
      toast.error('Instructions must be 500 characters or less.');
      return;
    }
    dispatch(updateAgent({
      id: agent.id,
      name: name.trim(),
      description: description.trim(),
      instructions: instructions.trim(),
      model: model,
      ownerId: userId
    })).then(() => {
      toast.success('Agent updated successfully');
      onClose();
    }).catch((error) => {
      toast.error('Failed to update agent: ' + error.message);
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Edit Agent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Agent name</Label>
          <Input
            id="agent-name"
            value={name ?? ''}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter agent name"
            disabled={isConnectedToChatbot}
          />
          {isConnectedToChatbot && (
            <p className="text-sm text-yellow-600">This agent is connected to a chatbot. The name cannot be changed.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-description">Description</Label>
          <Textarea
            id="agent-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter agent description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-instructions">Instructions</Label>
          <Textarea
            id="agent-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Enter agent instructions"
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-model">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="agent-model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Agent</Button>
      </CardFooter>
    </Card>
  );
};

export default EditAgentForm;
