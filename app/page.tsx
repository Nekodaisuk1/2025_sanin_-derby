import PartyForm from '../src/components/PartyForm';

export default function Page() {
  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">議席予測</h1>
      <PartyForm />
    </main>
  );
}
