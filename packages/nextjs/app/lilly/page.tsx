"use client";
import React, { FormEvent, useState } from "react";
import Image from "next/image";

const LillyPage: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:3001/api/cliWrapper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      });
      const imageURL = await response.text();
      setOutput(imageURL);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false); // End loading
  };

  return (
    <main>
      <div className="flex min-h-screen flex-col items-center p-24">
        <div className="z-10 max-w-full w-full flex flex-col items-center justify-center font-mono text-sm space-y-4">
          <h1>Lilypad Image Generator</h1>
          <div className="w-full flex flex-col items-center">
            {!output && (
              <div className="border-dashed border-2 border-gray-300 w-full h-full flex items-center justify-center">
                {isLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : (
                  <span className="text-gray-500">Image will appear here</span>
                )}
              </div>
            )}
            {output && <Image src={output} alt="Generated" layout="responsive" width={100} height={100} />}
            <form onSubmit={handleSubmit} className="w-full mt-2">
              <textarea
                className="w-full p-2"
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                placeholder="Enter your prompt"
                rows={4}
              />
              <div className="w-full flex justify-end">
                <button type="submit" className="mt-4">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LillyPage;