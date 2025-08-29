"use client";

import React, { useEffect, useState } from "react";
import { client } from "@/lib/appwrite";
import { AppwriteException } from "appwrite";

const Ping = () => {
  const [pingStatus, setPingStatus] = useState("Pinging Appwrite...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sendPing = async () => {
      try {
        const response = await client.ping();

        if (response) {
          setPingStatus("Appwrite Ping successful.");
          setError(null);
        } else {
          setPingStatus("Appwrite Ping received unexpected response.");
          setError(`Response: ${JSON.stringify(response)}`);
        }
      } catch (err: unknown) {
        if (err instanceof AppwriteException) {
          setPingStatus("Failed to ping Appwrite.");
          setError(
            `Error: ${err.message}. Code: ${err.code}, Type: ${err.type}`
          );
          console.log("appwrite error", err);
        } else {
          setPingStatus("Failed to ping Appwrite.");
          setError(
            `Unexpected error: ${
              err instanceof Error ? err.message : String(err)
            }.`
          );
          console.log("not appwrite error", err);
        }
      }
    };

    sendPing();
  }, []);

  return <div>{!error ? pingStatus : error}</div>;
};

export default Ping;
