// app/addWithImage/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (request) => {
  console.log("Made it in the server func");
  const { image } = await request.json();
  console.log("Got image");
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPEN_AI_API_KEY}`,
  };

  const payload = {
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What’s in this image?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": `data:image/jpeg;base64,${image}`,
              "detail": "low"
            }
          }
        ]
      }
    ],
    "max_tokens": 300
  };

  try {
    console.log("trying");
    const response = await axios.post("https://api.openai.com/v1/chat/completions", payload, { headers });
    const choiceContent = response.data.choices[0].message.content;
    return NextResponse.json(choiceContent);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};