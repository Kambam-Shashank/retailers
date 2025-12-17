import { useCallback, useEffect, useRef, useState } from "react";

export interface GoldPriceData {
  sell_price_999?: number;
  sell_price_995?: number;
  gold_999?: number;
  gold_995?: number;
  price_999?: number;
  price_995?: number;
  timestamp?: number;
  providers_count?: number;
  [key: string]: any;
}

interface WebSocketMessage extends GoldPriceData {
  type?: string;
  [key: string]: any;
}

export default function useWebSocket(uri: string) {
  const [data, setData] = useState<GoldPriceData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValidData, setLastValidData] = useState<GoldPriceData | null>(
    null
  );
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      const wsUrl =
        uri.startsWith("ws://") || uri.startsWith("wss://")
          ? uri
          : `wss://${uri}`;

      const ws = new WebSocket(wsUrl);

      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        // console.log("connected to karatpay");
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          console.log("WebSocket raw data:", parsedData);

          if (parsedData && typeof parsedData === "object") {
            let validData: GoldPriceData | null = null;

            if (
              "sell_price_999" in parsedData ||
              "sell_price_995" in parsedData
            ) {
              validData = parsedData as GoldPriceData;
            } else if (parsedData.data && typeof parsedData.data === "object") {
              // Handle nested data structure
              validData = parsedData.data as GoldPriceData;
            } else {
              console.warn("Unexpected data structure:", parsedData);
            }

            if (validData) {
              console.log("Valid WebSocket data:", validData);
              setData(validData);
              setLastValidData(validData);
            }
          } else {
            console.warn("Invalid data format:", parsedData);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          console.log("Raw message data:", event.data);
        }
      };
      ws.onerror = () => {
        setError("websocket Error occured");
      };
      ws.onclose = () => {
        setIsConnected(false);
        // console.log("karatpay connection closed, attempting to reconnect...");
        setTimeout(connect, 3000);
      };
    } catch (error) {
      setError("Failed to connect to websocket");
    }
  }, []);
  const sendMessage = (msg: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };
  const reconnect = () => {
    if (wsRef.current) wsRef.current.close;
    connect();
  };
  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);
  return {
    data: data || lastValidData,
    isConnected,
    error,
    sendMessage,
    reconnect,
  };
}
