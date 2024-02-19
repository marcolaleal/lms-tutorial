"use client"

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { File, Loader2, PlusCircle, X } from "lucide-react";

import { Attachment ,Course } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletimgId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubimit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Curso atualizado com sucesso!")
      toggleEdit();

      router.refresh();
    } catch {
      toast.error("Algo deu errado...");
    }
  }

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      console.log("Cheguei aqui");
      toast.success("Anexo removido com sucesso")
      router.refresh();
    } catch (error) {
      toast.error("Algo deu errado...");
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Anexos
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancelar</>
          )}
          {!isEditing &&  (
            <>
              <PlusCircle className="h-4 w-4 mr-2"/>
              Add arquivo
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 ? (
            <p className="text-sm mt-2 text-slate-500 italic ">
              Nenhum anexo encontrado...
            </p>
          ) : (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                  <p className="text-xs line-clamp-1">
                    {attachment.name}
                  </p>
                  {deletimgId === attachment.id && (
                    <div>
                      <Loader2 className="h-4 w-4 animate-spin"/>
                    </div>
                  )}
                  {deletimgId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4"/>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
        )
      } 
      
      {isEditing && (
        <div>
          <FileUpload 
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubimit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Adicione material complementar ao seu curso. 
          </div>  
        </div>
      )}
    </div>
  )
}
