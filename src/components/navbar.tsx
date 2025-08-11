import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserRound, BookOpen, Home } from "lucide-react";

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">AI Study</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-2">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/user" className="flex items-center space-x-1">
              <UserRound className="h-4 w-4" />
              <span>Users</span>
            </Link>
          </Button>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
