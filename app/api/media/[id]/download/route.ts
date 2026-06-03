import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const media = await prisma.media.findUnique({
      where: { id },
      include: {
        album: {
          include: {
            event: true,
          },
        },
        uploadedBy: true,
      },
    });

    if (!media) {
      return NextResponse.json(
        { error: "Media not found" },
        { status: 404 }
      );
    }

    if (media.mediaType !== "IMAGE") {
      return NextResponse.json(
        { error: "Watermarked download currently supports images only" },
        { status: 400 }
      );
    }

    const response = await fetch(media.fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image from storage" },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const image = Buffer.from(arrayBuffer);

    const watermarkText = `CIG Media Platform • ${media.album.event.name}`;

    const svgWatermark = `
      <svg width="1200" height="140">
        <rect width="1200" height="140" fill="rgba(0,0,0,0.50)" />
        <text
          x="40"
          y="88"
          font-size="42"
          font-family="Arial"
          fill="white"
          font-weight="bold"
        >
          ${watermarkText}
        </text>
      </svg>
    `;

    const watermarkedImage = await sharp(image)
      .composite([
        {
          input: Buffer.from(svgWatermark),
          gravity: "south",
        },
      ])
      .jpeg({ quality: 90 })
      .toBuffer();

    return new Response(watermarkedImage as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="watermarked-${media.id}.jpg"`,
      },
    });
  } catch (error: any) {
    console.error("WATERMARK_DOWNLOAD_ERROR", error);

    return NextResponse.json(
      { error: error?.message || "Failed to generate watermarked download" },
      { status: 500 }
    );
  }
}