export interface Feedback {
    clarity: string;
    empathy: string;
    communication: string;
    roleFit: string;
    positive: string;
    toImprove: string;
    example: string;
    score: number; // CC-IRI Score (0-100)
    category: 'Not Ready' | 'Borderline' | 'Interview Ready';
    competencies: {
        empathy: number;
        clarity: number;
        conflict: number;
        structure: number;
        professionalism: number;
    };
    suggestedRevision: string;
}

export type ScenarioType =
    | 'General' | 'Angry Customer' | 'Technical Issue' | 'Escalation'
    | 'Cold Calling' | 'Sales Objection' | 'Closing'
    | 'Tech Troubleshooting' | 'Complex Explanation';


export interface Scenario {
    id: ScenarioType;
    role: string;
    name: string;
    description: string;
    questions: string[];
}


export const SCENARIOS: Scenario[] = [
    // Inbound Customer Support
    {
        id: 'General',
        role: 'Inbound Customer Support',
        name: 'Standard Inbound Support',
        description: 'General interview questions for an entry-level support role.',
        questions: [
            "Please tell me about yourself and your background.",
            "Why do you want to work in a call centre environment?",
            "How do you handle a situation where a customer is being extremely angry or abusive on the phone?",
            "Can you describe a time when you went above and beyond for a customer?",
            "How would you handle a technical issue you don't know the answer to while on a live call?",
            "Where do you see yourself in two years within this company?",
            "Thank you. This concludes our interview. I'm processing your feedback now..."
        ]
    },
    {
        id: 'Angry Customer',
        role: 'Inbound Customer Support',
        name: 'De-escalation Masterclass',
        description: 'Heavy focus on empathy, patience, and de-escalation tactics.',
        questions: [
            "A customer has been waiting for 20 minutes and starts the call by yelling. How do you respond?",
            "What specific words do you use to show empathy without promising something you can't deliver?",
            "The customer demands to speak to a manager immediately. How do you handle this?",
            "How do you maintain your own professional composure after a difficult call like this?",
            "Thank you. I'm analysing your de-escalation skills now..."
        ]
    },
    {
        id: 'Escalation',
        role: 'Inbound Customer Support',
        name: 'Supervisor Escalation',
        description: 'High-pressure interview for handling legal threats and extreme demands.',
        questions: [
            "The customer says: 'I've been a loyal member for 10 years, and if you don't refund me right now, I'm calling my lawyer.' How do you regain control?",
            "How do you professionally tell a customer that their request is outside of your company's policy, even after they've escalated to you?",
            "A customer is being racist or highly abusive towards your agent. What are your first three steps as a supervisor?",
            "How do you balance being 'customer-centric' with protecting the company's bottom line during a negotiation?",
            "Thank you. High-pressure analysis is complete. Generating your leadership report..."
        ]
    },

    // Outbound Sales
    {
        id: 'Cold Calling',
        role: 'Outbound Sales',
        name: 'The Perfect Pitch',
        description: 'Mastering the art of the initial contact and grab-attention hooks.',
        questions: [
            "You have 10 seconds to hook a prospect who just picked up the phone. What's your opening?",
            "A prospect says 'I'm not interested' before you even finish your sentence. How do you pivot?",
            "How do you research a prospect before a call to ensure your pitch is personalized?",
            "What is your strategy for getting past the 'Gatekeeper' (secretary/assistant)?",
            "Thank you. Your pitching skills are being evaluated now..."
        ]
    },
    {
        id: 'Sales Objection',
        role: 'Outbound Sales',
        name: 'Objection Handling',
        description: 'Focus on turning "No" into "Tell me more" through value-based selling.',
        questions: [
            "The prospect says: 'Your competitor is 50% cheaper.' How do you justify our value without bashing the competition?",
            "The prospect says: 'We don't have the budget for this right now.' How do you handle this soft rejection?",
            "Explain a time you turned a hard 'No' into a closed deal. What was the turning point?",
            "How do you handle a prospect who is being dismissive of the product's benefits?",
            "Thank you. Analyzing your negotiation tactics..."
        ]
    },
    {
        id: 'Closing',
        role: 'Outbound Sales',
        name: 'The Art of the Close',
        description: 'Precision timing and confidence for sealing the deal.',
        questions: [
            "What is your preferred closing technique (e.g., The Assumptive Close, The Summary Close) and why?",
            "A prospect is 90% there but hesitant. What's the final nudge you give them?",
            "How do you handle contract negotiations where the prospect asks for a discount you can't give?",
            "Tell me about a time you lost a deal at the very last second. What did you learn?",
            "Thank you. Finalizing your sales performance report..."
        ]
    },

    // Technical Support
    {
        id: 'Tech Troubleshooting',
        role: 'Technical Support',
        name: 'Logic & Diagnostics',
        description: 'Deep dive into your step-by-step problem-solving methodology.',
        questions: [
            "A customer says 'My internet is slow.' Walk me through your first three diagnostic questions.",
            "How do you handle a customer who thinks they know more than you and is giving wrong technical info?",
            "Describe a complex technical issue you solved. How did you identify the root cause?",
            "How do you document a unique bug for the development team to ensure they can replicate it?",
            "Thank you. Your diagnostic logic is being analyzed..."
        ]
    },
    {
        id: 'Complex Explanation',
        role: 'Technical Support',
        name: 'The Translator',
        description: 'Focus on simplifying complex technical concepts for non-tech users.',
        questions: [
            "Explain how 'End-to-End Encryption' works to a 5-year old.",
            "A customer is frustrated because a fix is taking too long. How do you explain the technical complexity without sounding like you're making excuses?",
            "What's your approach to teaching a non-technical user a new software feature over the phone?",
            "How do you stay updated with rapidly changing technology in your field?",
            "Thank you. Assessing your technical communication style..."
        ]
    }
];


const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';

export const aiService = {
    getQuestions: (scenarioId: ScenarioType = 'General'): string[] => {
        const scenario = SCENARIOS.find(s => s.id === scenarioId) || SCENARIOS[0];
        return scenario.questions;
    },

    generateContextualResponse: async (
        history: { role: 'ai' | 'user'; content: string }[],
        nextQuestion: string,
        scenario: string
    ): Promise<string> => {
        if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
            console.warn("DeepSeek API key missing, using fallback.");
            return nextQuestion;
        }

        const systemPrompt = `You are Vicky, a professional, empathetic, and encouraging contact center interviewer at PrepGenius.
Your goal is to conduct a realistic interview for the role of ${scenario}.

CURRENT INTERVIEW FLOW:
- You have the user's previous responses.
- You have a PRE-DEFINED NEXT QUESTION that MUST be asked to keep the interview on track.

YOUR TASK:
1. Provide a VERY BRIEF (max 1 sentence) contextual reaction or acknowledgement of the user's last answer. 
2. Transition smoothly and naturally into the next interview question provided below.
3. Keep the tone professional but welcoming.
4. Do NOT answer student questions deeply; maintain the interviewer persona.

NEXT QUESTION TO ASK:
"${nextQuestion}"

Response format: [Brief Acknowledgement] [Smooth Transition] [The Next Question]`;

        try {
            const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...history.map(m => ({
                            role: m.role === 'ai' ? 'assistant' : 'user',
                            content: m.content
                        }))
                    ],
                    temperature: 0.7,
                    max_tokens: 250
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'DeepSeek API error');
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error("DeepSeek call failed:", error);
            // Fallback to just the next question if AI fails
            return nextQuestion;
        }
    },

    generateFeedback: async (responses: string[], _scenarioId: ScenarioType = 'General', isVoice: boolean = false): Promise<Feedback> => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const totalWords = responses.join(' ').split(/\s+/).length;
        const hasEmpathy = responses.some(r =>
            ['sorry', 'understand', 'listen', 'apologize', 'hear you'].some(word => r.toLowerCase().includes(word))
        );
        const hasSTAR = responses.some(r =>
            ['situation', 'task', 'action', 'result', 'because', 'therefore'].some(word => r.toLowerCase().includes(word))
        );
        const hasConflict = responses.some(r =>
            ['calm', 'solution', 'help', 'fix', 'policy'].some(word => r.toLowerCase().includes(word))
        );

        // Competency Scores (0-100)
        const competencies = {
            empathy: hasEmpathy ? 85 : 45,
            clarity: totalWords > 150 ? 90 : 60,
            conflict: hasConflict ? 80 : 50,
            structure: hasSTAR ? 85 : 40,
            professionalism: responses.length > 3 ? 90 : 70
        };

        // Basic CC-IRI Score logic
        let score = Math.round(
            (competencies.empathy * 0.25) +
            (competencies.clarity * 0.20) +
            (competencies.conflict * 0.20) +
            (competencies.structure * 0.15) +
            (competencies.professionalism * 0.20)
        );

        score = Math.min(score, 98); // Max score 98 for mock

        let category: Feedback['category'] = 'Not Ready';
        if (score > 80) category = 'Interview Ready';
        else if (score > 60) category = 'Borderline';

        let positive = isVoice
            ? "Your vocal tone was professional and you maintained a steady pace throughout the interview."
            : "Your written responses were clear and showed a good grasp of customer service fundamentals.";

        let toImprove = isVoice
            ? "Try to reduce verbal fillers and focus on clear articulation during complex explanations."
            : "Try to use more STAR (Situation, Task, Action, Result) method in your situational answers.";

        let example = isVoice
            ? "Instead of 'uhm, I think...', try starting with 'Certainly, I can explain that...'"
            : "Instead of 'I helped them', say 'I identified that the customer was frustrated by the delay, so I took ownership and communicated a specific timeline...'";

        // Role-specific nuances
        if (_scenarioId === 'Tech Troubleshooting' || _scenarioId === 'Complex Explanation') {
            if (competencies.clarity < 70) {
                toImprove = "Your technical explanations are a bit dense. Focus on using analogies (like comparing a router to a gateway) to help non-technical users.";
            }
            positive = "You showed great patience and logical structure in your troubleshooting steps.";
            example = "Instead of 'Reboot the DNS cache', try 'Let's try refreshing your connection by clearing out some old data, which is like giving your computer a quick reset.'";
        } else if (_scenarioId === 'Escalation') {
            if (competencies.professionalism < 70) {
                toImprove = "When a customer threatens legal action, remain neutral. Avoid sounding defensive or dismissive of their concerns.";
            }
            positive = "You maintained excellent professional boundaries and did not cave to unreasonable demands.";
            example = "Instead of 'You can't do that', try 'I understand you feel that is your next step. My goal here is to find a resolution within our current policy so we can settle this today.'";
        } else if (_scenarioId === 'Cold Calling' || _scenarioId === 'Sales Objection' || _scenarioId === 'Closing') {
            if (competencies.structure < 70) {
                toImprove = "In sales, momentum is key. Try to use more 'Assumptive' language to guide the prospect towards the next step.";
            }
            positive = "You demonstrated high energy and excellent resilience when handling pushback.";
            example = "Instead of 'Would you like to buy?', try 'Based on what you've shared, it seems like our solution is exactly what you need to hit those targets. Shall we get the paperwork started?'";
        }

        return {
            clarity: totalWords > 100 ? "Good" : "Needs work",
            empathy: hasEmpathy ? "Strong" : "Average",
            communication: totalWords > 150 ? "Professional" : "A bit brief",
            roleFit: "High",
            positive,
            toImprove,
            example,
            score,
            category,
            competencies,
            suggestedRevision: responses[responses.length - 1]
                ? `I understand your frustration with the wait, and I sincerely apologize. While I cannot change the policy, I can certainly investigate the current status and see how we can expedite this for you. Shall we look at your account together?`
                : "No response detected to refine."
        };
    },

    analyzeVoice: (_blob: Blob): Promise<{ clarity: number; pace: string; fillers: string[] }> => {
        // Mock voice analysis
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    clarity: 0.85,
                    pace: 'Natural',
                    fillers: ['um', 'like', 'ah']
                });
            }, 1000);
        });
    }
};
