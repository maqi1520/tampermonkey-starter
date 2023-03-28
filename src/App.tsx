import React, { useEffect, useState, useRef } from "react";
import { Popover } from "antd";
import Content from "./Content";
import Setting from "./Setting";
import icon from "./icon.png";

export default function App() {
  const display = useRef(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [style, setStyle] = useState({});
  const [basicInfo, setBasicInfo] = useState({
    url: "",
    key: "",
  });
  useEffect(() => {
    const value =
      typeof GM_getValue === "function"
        ? GM_getValue("basicInfo")
        : JSON.parse(localStorage.getItem("basicInfo") || "{}");
    console.log(value);
    if (value.key) {
      setBasicInfo(value);
    }
  }, []);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  useEffect(() => {
    const mouseup = (event: MouseEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && !display.current) {
        display.current = true;
        setStyle({
          display: "block",
          left: event.pageX + 80 + "px",
          top:
            event.pageY - 50 < 0
              ? event.pageY + 8 + "px"
              : +event.pageY - 50 + "px",
        });
        setKeyword(selection);
        // 执行翻译逻辑
      }
    };
    const mousedown = ({ target }: MouseEvent) => {
      if (target && ref.current && !ref.current.contains(target as Node)) {
        display.current = false;
        setOpen(false);
        setStyle({
          display: "none",
        });
      }
    };
    document.addEventListener("mouseup", mouseup);
    document.addEventListener("mousedown", mousedown);
    return () => {
      document.removeEventListener("mouseup", mouseup);
      document.removeEventListener("mousedown", mousedown);
    };
  }, []);

  return (
    <span ref={ref}>
      <Popover
        onOpenChange={(open) => setOpen(open)}
        getPopupContainer={(e) => ref.current!}
        title={"GPT"}
        open={open}
        placement="right"
        trigger="click"
        content={
          basicInfo.key ? (
            <Content
              apiKey={basicInfo.key}
              baseUrl={basicInfo.url}
              keyword={keyword}
            />
          ) : (
            <Setting setBasicInfo={setBasicInfo} />
          )
        }
      >
        <button style={style} className="fixed-button">
          <img src={icon} width="30" height={30} />
        </button>
      </Popover>
    </span>
  );
}
