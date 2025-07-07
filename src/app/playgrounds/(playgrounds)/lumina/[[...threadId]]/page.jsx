"use client"
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

function ThreadIdpage({ setCurrThreadID }) {

  // managing geting threadid from url
  const params = useParams();
  // params.threadId can be undefined, a string, or an array (for catch-all routes)
  const threadId = params.threadId;
  const threadIdValue = Array.isArray(threadId) ? threadId[0] : threadId;

  useEffect(() => {
    console.log("007")
    if (typeof threadIdValue !== "undefined") {
      setCurrThreadID(threadIdValue);
    } else {
      setCurrThreadID(null);
    }
    console.log(threadId);
    console.log(threadIdValue);
  }, [threadIdValue]);

  return null; // :) this component renders nothing
}

export default ThreadIdpage
