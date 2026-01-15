import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import {
  FileText,
  Send,
  Eye,
  Lock,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const HomePage = async () => {
  const { userId } = await auth();

  return (
    <main className="mx-auto md:px-4 md:pb-4">
      <section className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-semibold tracking-tight">
              Secure File Sharing
              <span className="block bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share files with role-based access control. Senders create,
              receivers view. Complete control over who sees what.
            </p>
          </div>

          {!userId ? (
            <div className="flex col sm:row gap-4 justify-center pt-8">
              <Link href="/sign-in">
                <Button size="lg" className="text-base">
                  <Send className="h-5 w-5 mr-2" />
                  Start Sharing
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="lg" variant="outline" className="text-base">
                  Create Account
                </Button>
              </Link>
            </div>
          ) : (
            <div className="pt-8">
              <Link href="/dashboard">
                <Button size="lg" className="text-base">
                  Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="pb-20 px-4 md:px-0">
        <div className="grid md:grid-cols-3 gap-6 md:gap-4 max-w-6xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">For Senders</h3>
            <p className="text-gray-600">
              Create file records, organize by category, and share metadata with
              ease. Full control over your content.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
              <Eye className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">For Receivers</h3>
            <p className="text-gray-600">
              View all shared files in one place. Browse detailed information
              about each record with ease.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-10 w-10 rounded-lg bg-gray-900 text-white flex items-center justify-center mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Secure & Fast</h3>
            <p className="text-gray-600">
              Role-based access control ensures only authorized users can
              perform actions. No unnecessary access.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 md:px-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Sign Up</h3>
                  <p className="text-gray-600">
                    Create an account and choose your role. Be a sender to share
                    files or a receiver to access them.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Choose Your Role</h3>
                  <p className="text-gray-600">
                    Senders create and manage file records. Receivers view and
                    access shared files from all senders.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Start Using</h3>
                  <p className="text-gray-600">
                    Access your dashboard. Senders create, receivers view. It's
                    that simple and secure.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 space-y-4 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Key Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-gray-900 shrink-0" />
                  <span>Instant record creation</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-gray-900 shrink-0" />
                  <span>Role-based access control</span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-gray-900 shrink-0" />
                  <span>Detailed file information</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-900 shrink-0" />
                  <span>Categorized organization</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-900 shrink-0" />
                  <span>Secure by design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-15 md:py-20 max-w-7xl mx-auto bg-gray-900 md:rounded-2xl">
        <div className="w-full text-center text-white space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-gray-300 text-lg">
              Choose your role and start sharing files today.
            </p>
          </div>

          {!userId ? (
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/sign-in">
                <Button size="lg" variant="secondary" className="text-base">
                  <span className="hidden sm:inline">Sign In to Dashboard</span>
                  <span className="inline sm:hidden">Sign In</span>
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <span className="hidden sm:inline">Create New Account</span>
                  <span className="inline sm:hidden">Sign Up</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <span>Go To Dashboard</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
export default HomePage;
