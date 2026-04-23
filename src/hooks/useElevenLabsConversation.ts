import { useConversation } from '@11labs/react';
import { useCallback, useEffect } from 'react';

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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            endSession();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startSession = useCallback(async (agentId: string) => {
        try {
            await conversation.startSession({
                agentId,
                connectionType: 'webrtc',
            });
        } catch (error) {
            console.error("Failed to start session:", error);
            if (onError) onError(String(error));
        }
    }, [conversation, onError]);

    const endSession = useCallback(async () => {
        try {
            const convo = conversation as any;
            // Stop all audio playback immediately
            if (convo?.audioElement) {
                convo.audioElement.pause();
                convo.audioElement.src = '';
            }
            
            // Stop all audio tracks
            if (convo?.pc?.getSenders) {
                convo.pc.getSenders().forEach((sender: any) => {
                    if (sender.track) {
                        sender.track.stop();
                    }
                });
            }
            
            if (convo?.pc?.getReceivers) {
                convo.pc.getReceivers().forEach((receiver: any) => {
                    if (receiver.track) {
                        receiver.track.stop();
                    }
                });
            }
            
            // End the WebRTC session
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
