import dynamic from "next/dynamic";

const SystemInfo = dynamic(() => import("components/systeminfo"), {
  ssr: false,
});

function App() {
  return (
    <main>
      <SystemInfo />
    </main>
  );
}

export default App;
