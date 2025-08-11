import Navbar from "./navbar";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
