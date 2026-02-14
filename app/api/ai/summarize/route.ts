import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content) {
      return Response.json(
        { error: "Nội dung bài viết không được để trống" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "OpenAI API key chưa được cấu hình" },
        { status: 500 },
      );
    }

    const plainText = stripHtml(content);
    const truncatedText =
      plainText.length > 4000 ? plainText.slice(0, 4000) + "..." : plainText;

    const model = new ChatOpenAI({
      model: "gpt-4.1-mini",
      openAIApiKey: apiKey,
      temperature: 0.2,
      maxTokens: 256,
      streaming: true,
    });

    const messages = [
      new SystemMessage(
        `Bạn là trợ lý AI của Trường ĐH Công nghệ Kỹ thuật TP.HCM (HCM-UTE).
Tóm tắt bài viết trong 2-3 câu ngắn gọn bằng tiếng Việt.
Giữ nguyên tên riêng, số liệu quan trọng. Không thêm thông tin ngoài bài.`,
      ),
      new HumanMessage(
        `Tiêu đề: ${title || "Không có tiêu đề"}\n\nNội dung:\n${truncatedText}`,
      ),
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await model.stream(messages);
          for await (const chunk of response) {
            const text = typeof chunk.content === "string" ? chunk.content : "";
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token: text })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          console.error("Stream error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Lỗi khi tóm tắt. Thử lại sau." })}\n\n`,
            ),
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Summarization error:", error);
    return Response.json(
      { error: "Không thể tóm tắt bài viết. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
