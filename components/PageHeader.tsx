export default function PageHeader() {
  return (
    <header className="mb-8 flex flex-col items-center text-center sm:mb-12">
      <h1 className="max-w-4xl font-gosh text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Ethiopian cooking,{" "}
        <span className="text-primary block sm:inline">meet AI.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
        Generate authentic Ethiopian recipes, get instant substitutions, and
        build meal plans tailored to what you actually have.
      </p>
    </header>
  );
}
