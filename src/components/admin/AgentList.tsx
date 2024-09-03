import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchAgents, removeAgent } from '../../store/agentsSlice';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Agent } from '../../store/agentsSlice';

const AgentCard: React.FC<{ agent: Agent; onDelete: (id: string) => void }> = ({ agent, onDelete }) => (
  <Card>
    <CardHeader>
      <CardTitle>{agent.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">{agent.description}</p>
    </CardContent>
    <CardFooter className="justify-end space-x-2">
      <Button variant="outline" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" onClick={() => onDelete(agent.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

const AgentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const agents = useSelector((state: RootState) => state.agents.agents);
  const userId = useSelector((state: RootState) => state.auth.user?.uid);

  useEffect(() => {
    if (userId) {
      dispatch(fetchAgents(userId));
    }
  }, [dispatch, userId]);

  const handleDeleteAgent = (id: string) => {
    if (userId) {
      dispatch(removeAgent({ id, userId }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onDelete={handleDeleteAgent} />
      ))}
    </div>
  );
};

export default AgentList;
