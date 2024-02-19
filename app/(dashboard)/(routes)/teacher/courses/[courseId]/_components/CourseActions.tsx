"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { ConfirmModal } from "@/components/modals/ConfirmModal";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const CourseActions = ({
  disabled,
  courseId,
  isPublished
}: CourseActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const confetti = useConfettiStore();

  const onClick = async () => {
    try {
      setIsLoading(true);

      if(isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Publicação cancelada com sucesso")
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Curso publicado com sucesso")
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      toast.error("Algo deu errado...");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${courseId}`);
      toast.success("Curso excluido com sucesso")

      router.refresh();
      router.push(`/teacher/courses`);
    } catch (error) {
      toast.error("Algo deu errado...");
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Cancelar Publicação":"Publicar"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button 
          size="sm"
          disabled={isLoading}
        >
          <Trash 
            className="h-4 w-4"
          />
        </Button>
      </ConfirmModal>
    </div>
  )
}
