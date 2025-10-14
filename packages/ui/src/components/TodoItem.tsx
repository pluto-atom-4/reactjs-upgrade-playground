export function TodoItem({
  id,
  text,
  done,
  onToggle,
  onDelete,
}: {
  id: string;
  text: string;
  done: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex justify-between items-center border p-2 rounded">
      <span
        className={`cursor-pointer ${done ? 'line-through text-gray-500' : ''}`}
        onClick={() => onToggle(id)}
      >
        {text}
      </span>
      <button
        onClick={() => onDelete(id)}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </li>
  );
}
