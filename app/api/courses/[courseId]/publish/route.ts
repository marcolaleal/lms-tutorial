import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PATCH (
  req: Request,
  { params }: { params: { courseId: string }}
) {
  try {
    const { userId } = auth();

    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    };

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          }
        }
      }
    });

    if(!course) {
      return new NextResponse("Not Found", { status: 404 });
    };

    //percorre todos os chapters do curso e verifica se ha algum publicado
    // "some" é true para algum capitulo "every" seria para todos
    const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);
    
    if(!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
      return new NextResponse("Missing required fields", { status: 401 });
    }


    const publishedCourse = await db.course.update({
      where:{
        id: params.courseId,
        userId
      },
      data:{
        isPublished:true,
      }
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}