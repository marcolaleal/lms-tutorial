import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/db";
import { Banner } from "@/components/Banner";
import { IconBadge } from "@/components/IconBadge";
import { TitleForm } from "./_components/TitleForm";
import { ImageForm } from "./_components/ImageForm";
import { PriceForm } from "./_components/PriceForm";
import { CategoryForm } from "./_components/CategoryForm";
import { ChaptersForm } from "./_components/ChaptersForm";
import { CourseActions } from "./_components/CourseActions";
import { AttachmentForm } from "./_components/AttachmentForm";
import { DescriptionForm } from "./_components/DescriptionForm";

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  const { userId } = auth();

  if(!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId
    },
    include: {
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc" 
        }
      }
    },
  });

  if(!course) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner 
          label="Este curso nao está publicada e nao estará visível para os alunos."
          variant="warning"
        />
      )} 
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Configuração do curso
            </h1>
            <span className="text-sm text-slate-700 ">
              Complete todos os campos {completionText}
            </span>
          </div>
          <CourseActions 
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard}/>
              <h2 className="text-xl">
                Customize seu curso
              </h2>
            </div>
            <TitleForm 
              initialData={course}
              courseId={course.id}
              />
            <DescriptionForm
              initialData={course}
              courseId={course.id}
              />
            <ImageForm
              initialData={course}
              courseId={course.id}
              />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
              />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks}/>
                <h2 className="text-xl">
                  Aulas
                </h2>
              </div>
              <ChaptersForm
                initialData={course}
                courseId={course.id}
                />  
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign}/>
                <h2 className="text-xl">
                  Compre o curso completo  
                </h2>
              </div>
              <div>
                <PriceForm 
                  initialData={course}
                  courseId={course.id}
                  />
              </div>
              <div>
                <div className="flex items-center gap-x-2">
                  <IconBadge icon={File}/>
                  <h2 className="text-xl">
                    Recursos e Anexos  
                  </h2>
                </div>
                  <AttachmentForm
                    initialData={course}
                    courseId={course.id}
                    />
              </div>    
            </div>    
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage;