"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const colors = {
  reasonColor: "#ffffff",
  mainColor: "#969696",
  deepColor: "#ff5a00",
  promptColor: "#ffffff",
  synthColor: "#ffffff"
};

const CustomNode = ({ data, id }) => {
  return (
    <div
      className="flex flex-col bg-black/90 uppercase relative transition-transform hover:scale-[1.02] group rounded-xl"
      style={{
        border: `1px solid ${data.color}80`,
        borderLeft: `6px solid ${data.color}`,
        padding: "20px 28px",
        minWidth: "280px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxShadow: `0 8px 30px rgba(0,0,0,0.5), 0 0 20px ${data.color}25`,
        backdropFilter: "blur(10px)",
      }}
    >
      {data.branch && (
        <div
          style={{ color: data.color }}
          className="absolute -top-8 left-0 text-[13px] font-bold tracking-widest opacity-90 bg-black px-3 py-1 rounded-t-lg"
        >
          Branch: {data.branch}
        </div>
      )}
      <div className="flex justify-between items-center z-10 w-full gap-4">
        <span className="text-[18px] font-extrabold tracking-widest text-white">
          {data.label}
        </span>
        <span className="text-[14px] text-white/60 font-mono tracking-wider bg-white/10 px-2 py-1 rounded">
          {data.hash}
        </span>
      </div>

      {data.hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!bg-white !border-4 !border-black !w-5 !h-5 !rounded-full !-left-2.5"
        />
      )}
      {data.hasOutput && (
        <Handle
          type="source"
          position={Position.Right}
          className="!bg-white !border-4 !border-black !w-5 !h-5 !rounded-full !-right-2.5"
        />
      )}
    </div>
  );
};

export default function LuminaDAGPanel() {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const [nodes] = useState([
    {
      id: "boundary-group",
      type: "group",
      position: { x: 290, y: -60 },
      style: {
        width: 360,
        height: 480,
        border: "2px dashed rgba(255, 255, 255, 0.2)",
        backgroundColor: "rgba(255, 255, 255, 0.03)",
        borderRadius: "16px",
        zIndex: -1,
      },
      selectable: false,
      draggable: false,
    },
    {
      id: "boundary-label",
      type: "default",
      position: { x: 320, y: -150 },
      style: {
        background: "transparent",
        border: "none",
        color: "#ff5a00",
        fontSize: "28px",
        fontWeight: "bold",
        fontFamily: "system-ui, -apple-system, sans-serif",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        padding: 0,
        width: "auto",
        boxShadow: "none"
      },
      data: { label: "Isolated Contexts" },
      selectable: false,
      draggable: false,

    },
    {
      id: "prompt",
      type: "custom",
      position: { x: -40, y: 150 },
      data: {
        label: "User Prompt",
        hash: "#A0F1",
        color: colors.promptColor,
        hasOutput: true,
      },
    },
    {
      id: "reason",
      type: "custom",
      position: { x: 335, y: -10 },
      data: {
        label: "Reasoning Path",
        hash: "#B2C3",
        color: colors.reasonColor,
        branch: "EXPLORE/V1",
        hasInput: true,
        hasOutput: true,
      },
    },
    {
      id: "main",
      type: "custom",
      position: { x: 335, y: 150 },
      data: {
        label: "Main Context",
        hash: "#C0A4",
        color: colors.mainColor,
        hasInput: true,
        hasOutput: true,
      },
    },
    {
      id: "deep",
      type: "custom",
      position: { x: 335, y: 310 },
      data: {
        label: "Deep Think",
        hash: "#D9E5",
        color: colors.deepColor,
        branch: "DEEP-THINK/V1",
        hasInput: true,
        hasOutput: true,
      },
    },
    {
      id: "synthesis",
      type: "custom",
      position: { x: 740, y: 150 },
      data: {
        label: "Synthesis",
        hash: "#F3A1",
        color: colors.synthColor,
        hasInput: true,
      },
    },
  ]);

  const [edges] = useState([
    {
      id: "e1",
      source: "prompt",
      target: "reason",
      type: "smoothstep",
      animated: true,
      style: { stroke: colors.reasonColor, strokeWidth: 2, opacity: 0.7 },
    },
    {
      id: "e2",
      source: "prompt",
      target: "main",
      type: "smoothstep",
      animated: false,
      style: { stroke: colors.mainColor, strokeWidth: 2, opacity: 0.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: colors.mainColor },
    },
    {
      id: "e3",
      source: "prompt",
      target: "deep",
      type: "smoothstep",
      animated: true,
      style: { stroke: colors.deepColor, strokeWidth: 2.5, strokeDasharray: "5 5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: colors.deepColor },
    },
    {
      id: "e4",
      source: "reason",
      target: "synthesis",
      type: "smoothstep",
      animated: true,
      style: { stroke: colors.reasonColor, strokeWidth: 2, opacity: 0.7 },
    },
    {
      id: "e5",
      source: "main",
      target: "synthesis",
      type: "smoothstep",
      animated: false,
      style: { stroke: colors.mainColor, strokeWidth: 2, opacity: 0.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: colors.mainColor },
    },
    {
      id: "e6",
      source: "deep",
      target: "synthesis",
      type: "smoothstep",
      animated: true,
      style: { stroke: colors.deepColor, strokeWidth: 2.5, strokeDasharray: "5 5" },
      markerEnd: { type: MarkerType.ArrowClosed, color: colors.deepColor },
    },
  ]);

  return (
    <div className="flex w-full md:flex-1 relative items-center justify-center min-h-[500px] border border-white/20 bg-[#050505] overflow-hidden group hover:border-white/50 transition-colors duration-500 rounded-none cursor-pointer">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, minZoom: 0.5, maxZoom: 1.5 }}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color="rgba(255, 255, 255, 0.1)"
          gap={24}
          size={1.5}
          variant="cross"
        />
      </ReactFlow>
    </div>
  );
}
