import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyA6nurUo8o4U5fluQA-TyAUW5al37znqzM");
const MODEL_NAME = "gemini-1.5-flash-8b";

export class TranscriptionService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: MODEL_NAME });
  }

  async transcribeAudio(audioBase64: string, mimeType: string = "audio/wav"): Promise<string> {
    try {
      const result = await this.model.generateContent([
        {
          inlineData: {
            mimeType: mimeType,
            data: audioBase64
          }
        },
        { text: "Please transcribe the spoken language in this audio accurately. Ignore any background noise or non-speech sounds." },
      ]);

      return result.response.text();
    } catch (error) {
      console.error("Transcription error:", error);
      throw error;
    }
  }
} 