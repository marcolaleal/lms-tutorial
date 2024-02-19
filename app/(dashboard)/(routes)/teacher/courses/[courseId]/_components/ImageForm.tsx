"use client"

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";

import { Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(2, {
    message: "O campo 'imagem' é obrigatório",
  }),
});

export const ImageForm = ({
  initialData,
  courseId
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubimit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Curso atualizado com sucesso!")
      toggleEdit();

      router.refresh();
    } catch {
      toast.error("Algo deu errado...");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Imagem
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add imagem
            </>
          )}
          {!isEditing && initialData.imageUrl &&(
            <>
              <Pencil className="h-4 w-4 mr-2"/>
              Editar imagem
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500"/>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image 
              alt="upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        )
      )} 
      
      {isEditing && (
        <div>
          <FileUpload 
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubimit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            recomendado formato 16:9
          </div>  
        </div>
      )}
    </div>
  )
}
