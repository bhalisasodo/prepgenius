const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'EXAVITQu4qxIWDr7QN4w'; // Bella - Friendly and professional


export const elevenLabsService = {
    speak: async (text: string): Promise<HTMLAudioElement> => {
        if (!ELEVENLABS_API_KEY) {
            console.warn("ElevenLabs API Key missing. Falling back to browser speech.");
            throw new Error("API_KEY_MISSING");
        }

        try {
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_turbo_v2_5',

                    voice_settings: {
                        stability: 0.65,
                        similarity_boost: 0.75,
                        style: 0.06,
                        use_speaker_boost: true
                    },
                }),
            });


            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("ElevenLabs API Error Details:", errorData);
                throw new Error(`ElevenLabs API failed: ${response.status} ${response.statusText}`);
            }


            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            return audio;
        } catch (error) {
            console.error("ElevenLabs Error:", error);
            throw error;
        }
    }
};
