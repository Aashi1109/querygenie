import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import config from "@config";

const openai = new OpenAI({
  apiKey: config.OPEN_API_KEY, // This is the default and can be omitted
});

class OpenAIService {
  async getEmbeddings(texts: string[], modelname: string) {
    const embeddings = await openai.embeddings.create({
      input: texts,
      model: modelname,
    });

    return embeddings.data.map((data) => data.embedding);
  }

  async getAnswer(messages: ChatCompletionMessageParam[], modelname: string) {
    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: modelname,
    });

    return chatCompletion.choices[0].message.content;
  }
}

export default OpenAIService;
