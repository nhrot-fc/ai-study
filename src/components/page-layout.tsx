import Navbar from "./navbar";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 p-8">{children}</main>
    </div>
  );
};

export default PageLayout;
