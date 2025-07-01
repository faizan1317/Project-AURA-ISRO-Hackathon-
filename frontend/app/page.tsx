import { Header } from "../components/Header";
import { Button } from "../components/Button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header title="Project AURA" subtitle="ISRO Hackathon Frontend" />
      <Button variant="primary" className="mt-6">
        Get Started
      </Button>
    </main>
  );
}
