type NumberInputListProps = {
  values: string[];
  locked: boolean;
  onChange: (index: number, value: string) => void;
};

export function NumberInputList({ values, locked, onChange }: NumberInputListProps) {
  return (
    <div id="angka-input-container" className="mt-5 grid gap-3 md:grid-cols-2">
      {values.map((value, index) => (
        <div key={index} className="mb-3 flex flex-col">
          <label htmlFor={`angka_input_${index + 1}`} className="ms-3 dark:text-white">
            Masukkan angka ke-{index + 1}
          </label>
          <input
            id={`angka_input_${index + 1}`}
            type="number"
            min={1}
            value={value}
            onChange={(event) => onChange(index, event.target.value)}
            readOnly={locked}
            className="rounded-full border-3 border-pink-500 bg-gray-50 px-4 py-2 focus:outline-pink-500 dark:text-white dark:bg-black w-full focus:shadow-md shadow-pink-500/50 outline-none"
            placeholder={`contoh: ${index === 0 ? 12 : 48}`}
            required
          />
        </div>
      ))}
    </div>
  );
}
