import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { generateSmartTags } from "@/lib/smartTags";

export const runtime = "nodejs";

export async function GET() {
  const media = await prisma.media.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      album: {
        include: {
          event: true,
        },
      },
      uploadedBy: true,
      likes: true,
      favourites: true,
      comments: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(media);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const albumId = formData.get("albumId") as string;
    const uploadedById = formData.get("uploadedById") as string;

    if (!file || !albumId || !uploadedById) {
      return NextResponse.json(
        { error: "File, albumId and uploadedById are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: uploadedById,
      },
    });

    if (!user || !["ADMIN", "PHOTOGRAPHER", "VIEWER"].includes(user.role)) {
      return NextResponse.json(
        { error: "Only Admins and Photographers can upload media" },
        { status: 403 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mimeType = file.type;
    const mediaType = mimeType.startsWith("video") ? "VIDEO" : "IMAGE";

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "cig-event-media-platform",
            resource_type: mediaType === "VIDEO" ? "video" : "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            resolve(result);
          }
        )
        .end(buffer);
    });

    const album = await prisma.album.findUnique({
  where: {
    id: albumId,
  },
  include: {
    event: true,
  },
});

const uniqueTags = generateSmartTags({
  title: title || "",
  fileName: file.name,
  mediaType: mediaType.toLowerCase(),
  eventName: album?.event?.name,
  category: album?.event?.category,
});

    const media = await prisma.media.create({
      data: {
        title,
        mediaType,
        fileUrl: uploadResult.secure_url,
        fileSize: file.size,
        mimeType,
        albumId,
        uploadedById,
        tags: uniqueTags,
      },
      include: {
        album: true,
        uploadedBy: true,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error: any) {
    console.error("MEDIA_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { error: error?.message || String(error) },
      { status: 500 }
    );
  }
}