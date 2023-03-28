import React, { useState } from "react";
import { Input, Button, Spin } from "antd";
import { createParser } from "eventsource-parser";

type Props = {
  keyword: string;
  baseUrl: string;
  apiKey: string;
};

function speak(text: string) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = speechSynthesis.getVoices()[0];
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  }
}

export async function userscriptFetch(
  url: string,
  { body, headers, method, signal }: RequestInit
): Promise<any> {
  return new Promise((resolve) => {
    const handle = GM_xmlhttpRequest({
      url,
      data: body as string,
      headers: headers as any,
      method: method as any,
      responseType: "stream" as any,
      onreadystatechange: async function (r) {
        Object.assign(r, { body: r.response, status: r.status });
        if (r.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
          if (r.status === 200) {
            resolve(r);
          } else {
            const reader = r.response.getReader();
            const { value } = await reader.read();
            const str = new TextDecoder().decode(value);
            Object.assign(r, { json: () => JSON.parse(str) });
            resolve(r);
          }
        }
      },
    });
    signal?.addEventListener("abort", () => {
      handle.abort();
    });
  });
}

export default function Content({ keyword, apiKey, baseUrl }: Props) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const translate = async (text: string) => {
    const fetch =
      typeof GM_xmlhttpRequest === "function" ? userscriptFetch : window.fetch;
    const resp = await fetch(`${baseUrl}/v1/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Translate this into Chinese:
          ${text}`,
        max_tokens: 1000,
        temperature: 0,
        stream: true,
      }),
    });
    if (resp.status !== 200) {
      const res = await resp.json();
      setLoading(false);
      console.error(res);
      return;
    }
    const parser = createParser((event) => {
      if (event.type === "event") {
        const data = event.data;
        if (data === "[DONE]") {
          setLoading(false);
        }
        try {
          let json = JSON.parse(event.data);
          setResult((prev) => {
            return prev + json.choices[0].text;
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
    const data = resp.body;
    if (!data) {
      console.log("Error: No data received from API");

      return;
    }
    const reader = resp.body.getReader();
    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }
        const str = new TextDecoder().decode(value);
        parser.feed(str);
      }
    } finally {
      reader.releaseLock();
    }
  };

  return (
    <div style={{ width: 400 }}>
      <Input.TextArea autoSize value={keyword}></Input.TextArea>
      <p
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            setResult("");
            translate(keyword);
          }}
          type="primary"
        >
          翻译
        </Button>
        <svg
          fill="none"
          onClick={() => speak(keyword)}
          style={{ width: 24, cursor: "pointer" }}
          stroke="currentColor"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
          ></path>
        </svg>
      </p>
      <p>{result}</p>
    </div>
  );
}
