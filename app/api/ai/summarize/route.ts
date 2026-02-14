import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
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

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key chưa được cấu hình" },
        { status: 500 },
      );
    }

    // Strip HTML to get plain text
    const plainText = stripHtml(content);

    // Truncate to ~8000 chars to stay within token limits
    const truncatedText =
      plainText.length > 8000 ? plainText.slice(0, 8000) + "..." : plainText;

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      apiKey,
      temperature: 0.3,
      maxOutputTokens: 512,
    });

    const messages = [
      new SystemMessage(
        `Bạn là trợ lý AI của Trường Đại học Sư phạm Kỹ thuật TP.HCM (HCM-UTE). 
Nhiệm vụ: Tóm tắt bài viết ngắn gọn, rõ ràng bằng tiếng Việt.
Yêu cầu:
- Tóm tắt trong 3-5 câu, nêu bật ý chính
- Giữ nguyên tên riêng, số liệu, ngày tháng quan trọng
- Giọng văn trang trọng, phù hợp với bối cảnh đại học
- Không thêm thông tin ngoài bài viết`,
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
