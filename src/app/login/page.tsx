// Ini adalah Server Component (tanpa "use client")
import LoginForm from "./components/loginInput";

export default async function HomePage() {
  // Kamu bisa ambil data dari database di sini (Server Side)
  // const data = await db.query(...); 

  return (
    <main className="mt-20">
      <LoginForm/>
    </main>
  );
}