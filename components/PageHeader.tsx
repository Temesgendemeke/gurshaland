export default function PageHeader() {
  return (
    <div className="text-center mb-16 ">
      <div className="flex  justify-center">
        <p className="text-sm bg-primary  text-primary-foreground w-40 font-medium uppercase tracking-widest mb-4">
          AI Features
        </p>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold heading-primary mb-6">
        AI-Powered Cooking Experience
      </h1>
      <p className="text-lg text-body max-w-3xl mx-auto leading-relaxed">
        Discover the future of Ethiopian cooking with our intelligent features
        that help you create, learn, and master traditional recipes with modern
        AI assistance.
      </p>
    </div>
  );
}
