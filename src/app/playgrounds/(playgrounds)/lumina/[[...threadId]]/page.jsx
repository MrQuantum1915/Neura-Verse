"use client"
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useThreadStore } from '@/store/lumina/useThreadStore';

function ThreadIdpage({ setActiveNode }) {

  const params = useParams();
  const threadId = params.threadId;
  const threadIdValue = Array.isArray(threadId) ? threadId[0] : threadId; // array if we have subroute but it will be preceded with /. But nodeID is set as parameter -> ?node=1234

  const searchParams = useSearchParams();
  const nodeId = searchParams.get("node");

  useEffect(() => {
    if (typeof threadIdValue !== "undefined") {
      useThreadStore.getState().setThreadId(threadIdValue);
    } else {
      useThreadStore.getState().setThreadId(null);
    }
  }, [threadIdValue]);

  useEffect(() => {
    if (typeof nodeId !== "undefined") {
      setActiveNode(nodeId);
    } else {
      setActiveNode(null);
    }
  }, [nodeId]);

  return null; // :) this component renders nothing
}

export default ThreadIdpage
