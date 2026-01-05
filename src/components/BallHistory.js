export default function BallHistory({ history }) {
  return (
    <div className="flex gap-2 overflow-x-auto mt-2">
      {history.map((ball, index) => (
        <div
          key={index}
          className="min-w-[28px] h-7 flex items-center justify-center rounded-full text-xs font-bold bg-gray-200"
        >
          {ball}
        </div>
      ))}
    </div>
  );
}
