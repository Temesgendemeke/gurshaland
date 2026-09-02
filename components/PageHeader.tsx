export default function PageHeader() {
  return (
    <header className="mb-10 md:mb-16 text-center flex flex-col items-center ">
      <h1 className="font-gosh sm:max-w-4xl text-4xl  font-semibold leading-[1.06] tracking-tighter text-foreground sm:text-4xl sm:leading-[1.04] md:text-6xl lg:text-7xl">
        Ethiopian cooking,{" "}
        <span className="text-primary block sm:inline">meet AI.</span>
      </h1>

      <p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted-foreground  sm:mt-4 sm:text-lg md:text-xl">
        Generate authentic Ethiopian recipes, get instant substitutions, and
        build meal plans tailored to what you actually have.
      </p>
    </header>
  );
}
