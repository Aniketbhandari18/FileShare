"use client";

import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Input } from "./ui/input";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { filesize } from "filesize";
import { verifyRecordPassword } from "@/actions/recordActions";
import toast from "react-hot-toast";

type Props = {
  fileKey: string;
  fileName: string;
  fileSize: number;
};

const FilePasswordUnlock = ({ fileKey, fileName, fileSize }: Props) => {
  const [isPending, startTransition] = useTransition();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordUnlock = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await verifyRecordPassword(fileKey, password.trim());

      if (res.success) {
        toast.success("File unlocked successfully");
      } else {
        toast.error(res.error || "Something went wrong");
      }
    });
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      {/* Blurred backdrop hint */}
      <div className="absolute inset-0 bg-muted/40 backdrop-blur-xl" />

      <main className="relative z-10 w-full max-w-120 bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 pt-0 shadow-sm sm:px-4 px-2">
        <div className="text-center flex flex-col items-center">
          {/* Illustration */}
          <div className="relative w-full max-w-[320px] aspect-video flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-xl bg-primary/10 blur-3xl" />
            <div className="relative size-24 rounded-full bg-background border shadow-sm flex items-center justify-center">
              <Lock className="size-12 text-primary" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-3 mb-6 -mt-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              This file is password protected
            </h1>

            <p className="text-sm text-muted-foreground">
              {fileName}
              {fileSize ? ` • ${filesize(fileSize)}` : ""}
            </p>

            <p className="text-muted-foreground">
              The sender has secured this file. Enter the password to view or
              download it.
            </p>
          </div>

          {/* Password input */}
          <form className="w-full space-y-4" onSubmit={handlePasswordUnlock}>
            <div className="space-y-2 text-left">
              <label className="text-sm font-medium">Password</label>

              <div className="flex items-center rounded-lg border bg-background focus-within:ring-2 focus-within:ring-primary/50">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-0 focus-visible:ring-0"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="px-3 text-muted-foreground hover:text-primary cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Action */}
            <Button
              type="submit"
              className="w-full h-11"
              disabled={!password || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Unlocking File...
                </>
              ) : (
                "Unlock File"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};
export default FilePasswordUnlock;
