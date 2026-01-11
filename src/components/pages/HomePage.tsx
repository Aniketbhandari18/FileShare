import Link from "next/link";
import { Button } from "../ui/button";

const HomePage = () => {
  return (
    <div>
      <Button>
        <Link href="/sign-up">Sign up</Link>
      </Button>
      <Button>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    </div>
  );
};
export default HomePage;
