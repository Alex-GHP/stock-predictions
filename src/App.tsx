import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import OpenAI from "openai";
import { Card } from "./components/ui/card";
import { Progress } from "./components/ui/progress";

const Hero = () => {
  const [tickers, setTickers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    "Add up to 3 stock tickers below to get a super accurate stock predictions report 👇"
  );
  const [report, setReport] = useState("");

  async function fetchReport(data: string[]) {
    setLoading(true);
    const messages = [
      {
        role: "system",
        content:
          "ou are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 50 words describing the stocks performance and recommending whether to buy, hold or sell.",
      },
      {
        role: "user",
        content: data.toString(),
      },
    ];

    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });
      const response = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-3.5-turbo-0613",
        temperature: 0,
      });
      setReport(response.choices[0].message.content as string);
      console.log(response.choices[0].message.content);
    } catch (err) {
      setReport(`${err}`);
    } finally {
      setLoading(false);
    }
  }

  const handlePlusButton = () => {
    if (input.length >= 3) {
      setTickers([...tickers, input]);
      setMessage(
        "Add up to 3 stock tickers below to get a super accurate stock predictions report 👇"
      );
    } else
      setMessage(
        "You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla."
      );
    setInput("");
  };

  const clearAll = () => {
    setTickers([])
    setInput("")
    setReport("")
  }

  return (
    <section className="mx-auto max-w-2xl flex flex-col gap-y-6 mt-12 text-center px-12">
      <p
        className={`text-2xl lg:text-3xl font-semibold ${
          message.includes("Tesla") ? "text-red-600" : "text-black"
        }`}
      >
        {message}
      </p>
      <div className="flex space-x-2 justify-center">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="max-w-sm"
          placeholder="MSFT"
          id="ticker"
        />
        <Button
          type="submit"
          className="font-semibold text-2xl"
          onClick={() => handlePlusButton()}
        >
          +
        </Button>
      </div>
      <div className="flex justify-center">
        {tickers.map((ticker, index) => (
          <p className="uppercase" key={index}>
            {ticker}
            {index === tickers.length - 1 ? null : (
              <span className="mr-1">,</span>
            )}
          </p>
        ))}
      </div>
      <Button
        disabled={tickers.length ? false : true}
        className="max-w-fit mx-auto tracking-widest"
        onClick={() => fetchReport(tickers)}
      >
        GENERATE REPORT
      </Button>
      <Button
        disabled={tickers.length ? false : true}
        className="max-w-fit mx-auto tracking-widest"
        onClick={() => clearAll()}
      >
        CLEAR
      </Button>
      {loading ? <Progress value={33} /> : <Card className={`p-8 lg:text-2xl font-semibold ${report ? "flex" : "hidden"} `}>{report}</Card>}
      <p className="lg:text-2xl font-semibold">Always correct 15% of the time</p>
    </section>
  );
};

export default Hero;
