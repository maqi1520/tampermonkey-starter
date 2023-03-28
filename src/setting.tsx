import React, { useRef } from "react";
import { Input, Button, Form } from "antd";

type Props = {
  setBasicInfo: (value: any) => void;
};

export default function Content({ setBasicInfo }: Props) {
  const onFinish = (values: any) => {
    console.log("Success:", values);
    setBasicInfo(values);

    console.log(typeof GM_setValue);

    typeof GM_setValue === "function"
      ? GM_setValue("basicInfo", values)
      : localStorage.setItem("basicInfo", JSON.stringify(values));
  };

  return (
    <div style={{ width: 400 }}>
      <Form
        initialValues={{ url: "https://api.openai.com" }}
        onFinish={onFinish}
      >
        <Form.Item name="url" rules={[{ required: true, message: "Base Url" }]}>
          <Input name="url" placeholder="Base Url" />
        </Form.Item>
        <Form.Item
          name="key"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input name="key" placeholder="OpenAI API KEY" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            设置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
