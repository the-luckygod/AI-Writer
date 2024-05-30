import { Configuration, OpenAIApi } from "openai";
import config from "../../helpers/config";

export const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const basePromptPrefix = `
Write me a short article or essay for the title below.
Title:
`;

const generateAction = async (req, res) => {
  const model = config.useDefaultModel
    ? config.defaulModel
    : req.body?.model || config.defaulModel;
  const baseCompletion = await openai.createCompletion({
    model,
    prompt: `${req.body.basePrompt}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 100,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // Send over the Prompt output to our UI.
  res.status(200).json({ output: basePromptOutput });
};

//TODO: Deprecate
export default generateAction;
