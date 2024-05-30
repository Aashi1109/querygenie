import React, { ChangeEvent, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import createProjectSchema from "@/utils/schemas/createProject";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@/components/ui/dialog";
import { IFileDetails, IUser } from "@/types";
import { createFileData, createProject, updateProject } from "@/action";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type ICreateProjectSchema = Yup.InferType<typeof createProjectSchema>;
const CreateProject = () => {
  const { data } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<IFileDetails | null>(null);
  const userId = (data?.user as IUser)?.id;

  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<ICreateProjectSchema>({
    resolver: yupResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: ICreateProjectSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (submitButtonRef.current) submitButtonRef.current.disabled = true;
    try {
      // create project
      const projectCreateResult = await createProject(
        values.name,
        userId,
        values.description,
      );

      if (projectCreateResult?.success) {
        // upload file
        const fileUploadResult = await createFileData(
          selectedFile!.name,
          selectedFile!.format,
          selectedFile!.base64,
          projectCreateResult?.data?.id,
        );

        if (fileUploadResult?.success) {
          // update project with filedata
          const projectUpdateResult = await updateProject(
            projectCreateResult?.data?.id,
            undefined,
            undefined,
            fileUploadResult?.data?.id,
          );

          if (projectUpdateResult?.success) {
            toast({
              title: "Success",
              description: "Project created successfully",
            });
            router.push(`/projects?userId=${userId}`);
            cancelButtonRef.current?.click();
          }
        }
      }
    } catch (error) {
      console.error(`Error creating project ${error}`);
      if (submitButtonRef.current) submitButtonRef.current.disabled = false;
      toast({ description: "Error creating project" });
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      // setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedFile({
          base64: base64String,
          name: file.name,
          format: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description about project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload file</FormLabel>
              <FormControl>
                <Input
                  placeholder="PDF file"
                  {...field}
                  type={"file"}
                  multiple={false}
                  accept="application/pdf"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFileChange(e);
                  }}
                  value={field.value as string}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between p-0 flex-col gap-6">
          <Button className={"w-full"} type={"submit"} ref={submitButtonRef}>
            Create project
          </Button>
          <DialogClose>
            <Button
              variant="outline"
              className={"w-full"}
              type={"button"}
              ref={cancelButtonRef}
            >
              Cancel
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
};

export default CreateProject;
