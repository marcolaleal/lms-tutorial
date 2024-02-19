

import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    })

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true
      },
      select: {
        price: true
      }
    })

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      }
    })

    if(!course || !chapter) {
      throw new Error("Curso ou aula não encontrado");
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if(purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId
        }
      })

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          }
        },
        orderBy: {
          position: "asc",
        }
      })
    }

    if(chapter.isFree || purchase ){
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId
        }
      })
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        }
      }
    })
    
    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase
    }
  }catch(error) {
    console.log("GET_CHAPTER", error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    }
  }
}