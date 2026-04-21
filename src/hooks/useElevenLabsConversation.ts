import { useConversation } from '@11labs/react';
import { useCallback } from 'react';

export const useElevenLabsConversation = (
    onMessage?: (message: { source: string; message: string }) => void,
    onError?: (error: string) => void,
    onConnect?: () => void,
    onDisconnect?: () => void
) => {
    const conversation = useConversation({
        onConnect: () => {
            console.log("Connected to ElevenLabs Conversational AI");
            if (onConnect) onConnect();
        },
        onDisconnect: () => {
            console.log("Disconnected from ElevenLabs");
            if (onDisconnect) onDisconnect();
        },
        onMessage: (message: { source: string; message: string }) => {
            // console.log("ElevenLabs Message:", message);
            if (onMessage) onMessage(message);
        },
        onError: (error: string) => {
            console.error("ElevenLabs Error:", error);
            if (onError) onError(error);
        },
    });

    const startSession = useCallback(async (agentId: string) => {
        try {
            await conversation.startSession({
                agentId,
            });
        } catch (error) {
            console.error("Failed to start session:", error);
            if (onError) onError(String(error));
        }
    }, [conversation, onError]);

    const endSession = useCallback(async () => {
        try {
            await conversation.endSession();
        } catch (error) {
            console.error("Failed to end session:", error);
        }
    }, [conversation]);

    return {
        ...conversation,
        startSession,
        endSession
    };
};
