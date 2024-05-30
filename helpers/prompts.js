const prompts = [
  {
    name: "Article Essay Writer",
    subtitle:
      "Input the title to your article or essay, we'll generate the rest.",
    basePrompt: `
    Write me a short and complete article or essay for the title below, in 100 words.
    Title:
        `,
  },
  {
    name: "Summarizer",
    subtitle: "Input the text you want to summarize.",
    basePrompt: `
        Summarize the text below.
        Text:
        `,
  },
  {
    name: "Proof Reader",
    subtitle: "Input the text you want to proof read.",
    basePrompt: `
        Proofread and autocorrect this text.
        Text:
        `,
  },
];

export default prompts;
