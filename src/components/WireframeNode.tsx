import React from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './ui/card';
import { Trash2 } from 'lucide-react';
import { useWireframeStore } from '@/store/wireframe';

interface WireframeNodeProps {
  id: string;
  data: {
    title: string;
    description: string;
    actions: string[];
  };
}

export function WireframeNode({ id, data }: WireframeNodeProps) {
  const setSelectedElement = useWireframeStore(
    (state) => state.setSelectedElement
  );
  const removeAction = useWireframeStore((state) => state.removeAction);

  return (
    <div className="relative">
      {/* Input Handle at left with increased size and z-index */}
      <Handle
        type="target"
        id={`node-${id}`}
        position={Position.Left}
        className="!w-4 !h-4 !-left-2 !z-50 bg-orange-500 border-2 border-white cursor-crosshair"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />

      <Card
        className="w-[280px] relative bg-white shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setSelectedElement('node', id)}
      >
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-semibold">{data.title}</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {data.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-2 space-y-2">
          {data.actions.map((action, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-2 rounded-md hover:bg-gray-50 relative"
            >
              {/* Action content */}
              <div className="flex-1 mr-8">
                <span className="text-sm">{action}</span>
              </div>

              {/* Output handle on the right with increased size and z-index */}
              <Handle
                type="source"
                position={Position.Right}
                id={`action-${index}`}
                className="!w-4 !h-4 !-right-4 !z-50 bg-blue-500 border-2 border-white cursor-crosshair"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
