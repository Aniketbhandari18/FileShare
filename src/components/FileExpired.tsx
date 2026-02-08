import { Clock, Link2Off } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
  expiredAt: Date;
};

const FileExpired = ({ expiredAt }: Props) => {
  const formattedExpiredAt = format(
    new Date(expiredAt),
    "MMM d, yyyy 'at' h:mm a",
  );

  return (
    <div className="absolute inset-0 flex justify-center items-center pb-10">
      <main className="px-4">
        <div className="max-w-135 w-full text-center flex flex-col items-center">
          {/* Illustration */}
          <div className="relative w-full max-w-[320px] aspect-video flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-primary/10 blur-3xl" />

            <div className="relative size-25 rounded-full bg-background border shadow-sm flex items-center justify-center">
              <Clock className="absolute size-20 text-muted-foreground/30" />
              <div className="relative z-10 bg-background p-2 rounded-full border">
                <Link2Off className="size-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-4 mb-6 -mt-2">
            <h1 className="text-3xl font-bold tracking-tight">
              This link has expired
            </h1>

            <p className="text-muted-foreground">
              For security reasons, access to shared files is time-limited. The
              window for viewing or downloading this content has closed.
            </p>

            {expiredAt && (
              <p className="text-sm text-muted-foreground">
                Expired on {formattedExpiredAt}
              </p>
            )}
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
export default FileExpired;
