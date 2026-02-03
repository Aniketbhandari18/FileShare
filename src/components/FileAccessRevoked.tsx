import { ShieldBan } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

const FileAccessRevoked = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center pb-10">
      <main className="px-4">
        <div className="max-w-135 w-full text-center flex flex-col items-center">
          {/* Illustration */}
          <div className="relative w-full max-w-[320px] aspect-video flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-primary/10 blur-3xl" />

            <div className="relative size-25 rounded-full bg-background border shadow-sm flex items-center justify-center">
              <ShieldBan className="size-14 text-primary" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4 mb-6 -mt-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Access Revoked
            </h1>

            <p className="text-muted-foreground">
              This file is no longer available. The owner may have revoked
              access, the link has expired, or the file has been deleted.
            </p>

            <p className="text-sm text-muted-foreground">
              For security reasons, we can&apos;t provide further details about
              this file. Please contact the person who shared the link if you
              believe this is a mistake.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <Button className="min-w-40" asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
export default FileAccessRevoked;
