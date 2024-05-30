import OpenAI from "openai";
import config from "../../../helpers/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateAction = async (req, res) => {
  if (req.body.userInput.trim() == "") {
    throw Error("User Input is required");
  }

  const model = config.useDefaultModel
    ? config.defaultModel
    : req.body?.model || config.defaultModel;

  try {
    const stream = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: `${req.body.basePrompt}${req.body.userInput}`,
        },
      ],
      temperature: config.temperature,
      stream: true,
    });

    let basePromptOutput = "";

    for await (const chunk of stream) {
      basePromptOutput += chunk.choices[0]?.delta?.content || "";
    }

    res.status(200).json({ output: basePromptOutput });
  } catch (error) {
    res.status(error.status).json(error.error);
  }
};

export default generateAction;
