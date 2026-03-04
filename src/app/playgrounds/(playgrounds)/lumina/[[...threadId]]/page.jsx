"use client"
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function ThreadIdpage({ setCurrThreadID }) {

  const params = useParams();
  const threadId = params.threadId;
  const threadIdValue = Array.isArray(threadId) ? threadId[0] : threadId; // array if we have subroute but it will be preceded with /. However nodeID is set as parameter -> ?nodeID=1234

  // threadId will have a nodeId also

  const searchParams = useSearchParams();
  const nodeId = searchParams.get("nodeID");

  useEffect(() => {
    if (typeof threadIdValue !== "undefined") {
      setCurrThreadID(threadIdValue);
    } else {
      setCurrThreadID(null);
    }
  }, [threadIdValue]);

  return null; // :) this component renders nothing
}

export default ThreadIdpage
