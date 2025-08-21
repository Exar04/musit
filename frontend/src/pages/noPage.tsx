export function NoPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-black text-white">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <p className="text-3xl mb-6">Oops! The page you're looking for doesn't exist.</p>
      <a href="/" className="underline">
        Go back to Home
      </a>
    </div>
  );
}