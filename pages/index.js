import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";
import prompts from "../helpers/prompts";
import models from "../helpers/models";
import config from "../helpers/config";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyResponse, setCopyResponse] = useState("Copy to clipboard");

  const callGenerateEndpoint = async () => {
    if (userInput === "") {
      return;
    }
    setIsGenerating(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/v2/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput,
          basePrompt: selectedPrompt?.basePrompt || prompts[0],
          model: selectedModel || models[0],
        }),
      });
      const data = await response.json();
      if (data.type === "invalid_request_error") {
        setErrorMessage(data.message);
      } else {
        const { output } = data;
        setApiOutput(`${output}`);
      }
      setIsGenerating(false);
    } catch (error) {
      console.log(error);
      setIsGenerating(false);
      setErrorMessage(error.message);
    }
  };

  const onUserChangedText = (event) => {
    setUserInput(event.target.value.slice(0, 300));
  };

  const copyOutputToClipboard = () => {
    navigator?.clipboard?.writeText(apiOutput);
    setCopyResponse("Copied!");
    setTimeout(() => {
      setCopyResponse("Copy to clipboard!");
    }, 1500);
  };

  return (
    <div
      className={`root ${
        showFeedbackModal ? "overflow-hidden" : "overflow-auto"
      }`}
    >
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="my-container">
        <div className="header">
          <div className="header-title">
            <h1>AI Writer</h1>
          </div>
          <div className="header-subtitle">
            <h2>{selectedPrompt?.subtitle}</h2>
          </div>
        </div>
        <div>
          <p className="prompt-select-label">Writer Type</p>
          <select
            className="prompt-select"
            onChange={(event) => {
              setSelectedPrompt(prompts[event?.target?.value]);
            }}
          >
            {prompts.map((prompt, i) => (
              <option key={i} value={i}>
                {prompt?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="prompt-container">
          <textarea
            placeholder="start typing here"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText}
            cols={10}
            max={300}
          />
          <span className="text-white/50 text-xs text-right w-full mt-[-10px]">
            {userInput.length}/300
          </span>
          <div className="prompt-buttons">
            {!config.useDefaultModel && (
              <select
                className="prompt-select"
                value={selectedModel}
                onChange={(event) => {
                  setSelectedModel(event?.target?.value);
                }}
              >
                {models.map((model, i) => (
                  <option key={i} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            )}
            <button
              disabled={userInput == ""}
              className={
                isGenerating ? "generate-button loading" : "generate-button"
              }
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
                {isGenerating ? (
                  <span className="loader"></span>
                ) : (
                  <p>Generate</p>
                )}
              </div>
            </button>
            {errorMessage && (
              <p className="p-3 mb-4 bg-red-500 text-white rounded-md text-sm italic whitespace-pre-line">
                Error: {JSON.stringify(errorMessage)}
              </p>
            )}
          </div>
          {!errorMessage &&
            !isGenerating &&
            apiOutput &&
            apiOutput.length > 0 && (
              <div className="output">
                <div className="output-header-container">
                  <div className="output-header">
                    <h3>Output</h3>
                  </div>
                </div>
                <div className="output-content">
                  <p id="outputText">{apiOutput}</p>
                  {/* <div className="w-full flex justify-end mt-2">
                    <button
                      onClick={copyOutputToClipboard}
                      className="border border-[#ff4f12]/50 hover:bg-[#ff4f12]/50 text-[#ff4f12] hover:text-white text-sm p-2 rounded-full"
                    >
                      Copy to clipboard
                    </button>
                  </div> */}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="badge-container grow">
        <a target="_blank" rel="noreferrer">
          <div className="badge" onClick={() => setShowFeedbackModal(true)}>
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>Submit Feedback</p>
          </div>
        </a>
      </div>
      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-container">
          <div className="modal-content">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScYn7Tl1zDY06B8-x4AKZykr2s87WrhsGMKIXZvYWv7UV6bYQ/viewform"
              className="modal-form"
            />
            <button
              className="modal-close-button"
              onClick={() => setShowFeedbackModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
