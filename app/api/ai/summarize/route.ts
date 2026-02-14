import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/**
 * Strip HTML tags and decode entities to get plain text.
 */
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
      return NextResponse.json(
        { error: "Nội dung bài viết không được để trống" },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key chưa được cấu hình" },
        { status: 500 },
      );
    }

    // Strip HTML — truncate for speed
    const plainText = stripHtml(content);
    const truncatedText =
      plainText.length > 4000 ? plainText.slice(0, 4000) + "..." : plainText;

    const model = new ChatOpenAI({
      model: "gpt-4.1-mini",
      openAIApiKey: apiKey,
      temperature: 0.2,
      maxTokens: 256,
    });

    const messages = [
      new SystemMessage(
        `Bạn là trợ lý AI của Trường ĐH Sư phạm Kỹ thuật TP.HCM (HCM-UTE).
Tóm tắt bài viết trong 2-3 câu ngắn gọn bằng tiếng Việt.
Giữ nguyên tên riêng, số liệu quan trọng. Không thêm thông tin ngoài bài.`,
      ),
      new HumanMessage(
        `Tiêu đề: ${title || "Không có tiêu đề"}\n\nNội dung:\n${truncatedText}`,
      ),
    ];

    const response = await model.invoke(messages);
    const summary =
      typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI Summarization error:", error);
    return NextResponse.json(
      { error: "Không thể tóm tắt bài viết. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }
}
