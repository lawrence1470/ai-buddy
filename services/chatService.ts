export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isVoice?: boolean;
}

export class ChatService {
  private static messages: ChatMessage[] = [];

  static async sendMessage(
    userMessage: string,
    isVoice = false
  ): Promise<string> {
    try {
      // Add user message to history
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
        isVoice,
      };

      this.messages.push(userMsg);

      // Prepare conversation context (last 10 messages for context)
      const recentMessages = this.messages.slice(-10);
      const conversation = recentMessages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text,
      }));

      // Add system message
      const systemMessage = {
        role: "system",
        content:
          "You are a helpful AI assistant. Provide concise, friendly, and helpful responses. Keep your responses conversational and not too long since they will be read aloud.",
      };

      // Call OpenAI API
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [systemMessage, ...conversation],
            max_tokens: 150,
            temperature: 0.7,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content?.trim();

      if (!aiResponse) {
        throw new Error("No response from AI");
      }

      // Add AI response to history
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      this.messages.push(aiMsg);

      return aiResponse;
    } catch (error) {
      console.error("Chat service error:", error);

      // Return a fallback response
      const fallbackResponse =
        "I'm sorry, I'm having trouble responding right now. Please try again.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date(),
      };

      this.messages.push(aiMsg);

      return fallbackResponse;
    }
  }

  static getMessages(): ChatMessage[] {
    return [...this.messages];
  }

  static clearMessages(): void {
    this.messages = [];
  }

  static addMessage(message: ChatMessage): void {
    this.messages.push(message);
  }
}
