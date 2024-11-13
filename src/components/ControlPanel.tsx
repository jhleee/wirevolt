import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Trash2, Save, Upload } from 'lucide-react';
import { useWireframeStore } from '@/store/wireframe';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ControlPanel() {
  const [newAction, setNewAction] = React.useState('');
  const {
    addNode,
    selectedElement,
    nodes,
    edges,
    updateNode,
    updateEdge,
    setNodes,
    setEdges,
  } = useWireframeStore();

  const selectedNode = React.useMemo(() => {
    if (selectedElement.type === 'node') {
      return nodes.find((node) => node.id === selectedElement.id);
    }
    return null;
  }, [selectedElement, nodes]);

  const selectedEdge = React.useMemo(() => {
    if (selectedElement.type === 'edge') {
      return edges.find((edge) => edge.id === selectedElement.id);
    }
    return null;
  }, [selectedElement, edges]);

  const handleAddAction = () => {
    if (selectedNode && newAction.trim()) {
      updateNode(selectedNode.id, {
        ...selectedNode.data,
        actions: [...selectedNode.data.actions, newAction.trim()],
      });
      setNewAction('');
    }
  };

  // Save functionality
  const handleSave = () => {
    try {
      const wireframeData = {
        nodes,
        edges,
        metadata: {
          savedAt: new Date().toISOString(),
          version: '1.0',
        },
      };

      const blob = new Blob([JSON.stringify(wireframeData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `wireframe-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error saving wireframe:', error);
      // 여기에 에러 처리 UI를 추가할 수 있습니다
    }
  };

  // Load functionality
  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { nodes: loadedNodes, edges: loadedEdges } = JSON.parse(content);

        // 데이터 유효성 검사
        if (!Array.isArray(loadedNodes) || !Array.isArray(loadedEdges)) {
          throw new Error('Invalid file format');
        }

        setNodes(loadedNodes);
        setEdges(loadedEdges);
      } catch (error) {
        console.error('Error loading wireframe:', error);
        // 여기에 에러 처리 UI를 추가할 수 있습니다
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="w-80 border-r p-4 flex flex-col h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Control Panel</h2>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handleSave}
            title="Save Wireframe"
          >
            <Save className="h-4 w-4" />
          </Button>

          <label htmlFor="load-file" className="cursor-pointer">
            <Button
              size="icon"
              variant="outline"
              asChild
              title="Load Wireframe"
            >
              <div>
                <Upload className="h-4 w-4" />
                <input
                  id="load-file"
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleLoad}
                  onClick={(e) => {
                    // 같은 파일을 연속으로 선택할 수 있도록 value 초기화
                    (e.target as HTMLInputElement).value = '';
                  }}
                />
              </div>
            </Button>
          </label>

          <Button size="icon" onClick={addNode} title="Add Node">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {selectedNode && (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={selectedNode.data.title}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  ...selectedNode.data,
                  title: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={selectedNode.data.description}
              onChange={(e) =>
                updateNode(selectedNode.id, {
                  ...selectedNode.data,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Actions</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Add new action"
                onKeyPress={(e) => e.key === 'Enter' && handleAddAction()}
              />
              <Button size="icon" onClick={handleAddAction}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 space-y-2">
              {selectedNode.data.actions.map((action, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{action}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      updateNode(selectedNode.id, {
                        ...selectedNode.data,
                        actions: selectedNode.data.actions.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedEdge && (
        <div className="space-y-4">
          <div>
            <Label>Description</Label>
            <Input
              value={selectedEdge.data?.description || ''}
              onChange={(e) =>
                updateEdge(selectedEdge.id, {
                  ...selectedEdge.data,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label>Edge Style</Label>
            <Select
              value={selectedEdge.type || 'default'}
              onValueChange={(value) =>
                updateEdge(selectedEdge.id, {
                  ...selectedEdge.data,
                  type: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select edge style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="smoothstep">Smooth Step</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Edge Color</Label>
            <Select
              value={selectedEdge.data?.color || 'default'}
              onValueChange={(value) =>
                updateEdge(selectedEdge.id, {
                  ...selectedEdge.data,
                  color: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">#000000</SelectItem>
                <SelectItem value="#ff0000">Red</SelectItem>
                <SelectItem value="#0000ff">Blue</SelectItem>
                <SelectItem value="#00ff00">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Arrow Direction</Label>
            <Select
              value={selectedEdge.data?.arrowType || 'arrow'}
              onValueChange={(value) =>
                updateEdge(selectedEdge.id, {
                  ...selectedEdge.data,
                  arrowType: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select arrow type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arrow">Single Arrow</SelectItem>
                <SelectItem value="bidirectional">Bidirectional</SelectItem>
                <SelectItem value="none">No Arrow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
