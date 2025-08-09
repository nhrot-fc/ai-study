const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <main>{children}</main>
    </div>
  );
};

export default PageLayout;
