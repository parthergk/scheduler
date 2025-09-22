export default function App() {
  return (
    <div className=" flex justify-center items-center bg-neutral-600 w-screen h-screen">
      <div className=" w-full max-w-xl border p-3">
        <h1 className=" text-center text-xl">Your Schedule</h1>
        <div className=" flex flex-col gap-3 border mt-3 p-3">
          <div className=" self-end border px-1">month</div>
          <div className=" border px-1">
            <h2 className=" border-b">Week</h2>
            <div className=" mt-3 px-2 flex flex-col gap-1">
              <div>mon, 22,25</div>
              <div>tue, 23,25</div>
              <div>wed, 24,25</div>
              <div>thu, 25,25</div>
              <div>fri, 26,25</div>
              <div>sat, 27,25</div>
              <div>sun, 28,25</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
