"use client";

import { Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { createRecordFormSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FileCategory } from "@/generated/prisma/enums";
import { useState, useTransition } from "react";
import { parseFileName } from "@/lib/utils";

const CreateRecordButton = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const [fileExtension, setFileExtension] = useState<string>("");
  const [focus, setFocus] = useState<boolean>(false);

  const form = useForm<z.infer<typeof createRecordFormSchema>>({
    resolver: zodResolver(createRecordFormSchema),
    defaultValues: {
      file: undefined,
      fileName: "",
      fileDescription: "",
      category: "OTHER",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof createRecordFormSchema>) => {
    startTransition(() => {
      console.log("Form submitted");
      console.log(values);
    });
  };

  const handleOpenChange = () => {
    setOpen(!open);
    form.reset();
    setFileExtension("");
    setFocus(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>New Record</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Record</DialogTitle>
          <DialogDescription>
            Create a new record by uploading a file.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            {/* File Input */}
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...fieldProps}
                      className="pr-8"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.mp4,.webm,.mp3"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        onChange(file);

                        if (file) {
                          const { name, ext } = parseFileName(file.name);
                          form.setValue("fileName", name);

                          setFileExtension(`.${ext}`);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Name */}
            <FormField
              control={form.control}
              name="fileName"
              render={({ field: { onBlur, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <div className="flex relative">
                      <Input
                        onFocus={() => setFocus(true)}
                        onBlur={() => {
                          setFocus(false);
                          onBlur();
                        }}
                        className=""
                        placeholder="File name"
                        {...fieldProps}
                      />
                      {fileExtension && (
                        <div
                          className={`flex items-center px-3 bg-muted border border-input rounded-r-md text-muted-foreground text-sm font-medium select-none absolute top-0 right-0 bottom-0 ${focus && "border-x-gray-400 border-y-gray-400"}`}
                        >
                          {fileExtension}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Description */}
            <FormField
              control={form.control}
              name="fileDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the file..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select defaultValue="OTHER" onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Category"
                          className="font-semibold"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Category</SelectLabel>
                          {Object.values(FileCategory).map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              className="font-semibold"
                            >
                              {category[0].toUpperCase() +
                                category.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isPending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Record"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateRecordButton;
