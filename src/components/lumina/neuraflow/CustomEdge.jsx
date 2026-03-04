'use client'
import { BaseEdge, getBezierPath } from '@xyflow/react';

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const style = { stroke: '#ff5500', strokeWidth: 1 };

  return <BaseEdge id={id} path={edgePath} style={style} />;
}