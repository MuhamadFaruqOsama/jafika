import type { GameObject } from "@/app/features/jafika/types/fpb";
import Image from "next/image";

type ObjectPickerModalProps = {
  open: boolean;
  options: GameObject[];
  selectedObject: string;
  onSelect: (objectName: string) => void;
  onClose: () => void;
};

export function ObjectPickerModal({
  open,
  options,
  selectedObject,
  onSelect,
  onClose,
}: ObjectPickerModalProps) {
  if (!open) return null;

  return (
    <div
      id="drawer-pilih-objek"
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/30 p-4"
    >
      <div className="w-full max-w-3xl rounded-lg bg-white shadow-sm">
        <div className="flex items-center justify-between rounded-t border-b border-gray-200 p-4 md:p-5">
          <h3 className="text-xl font-semibold text-gray-900">Objek</h3>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-900"
            onClick={onClose}
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <div className="space-y-4 p-4 md:p-5">
          <div className="rounded-md border border-yellow-500 bg-yellow-100 p-2 text-sm">
            Objek ini adalah hal yang akan merepresentasikan hasil pembagian FPB.
          </div>

          <ul id="pilihan-objek" className="grid w-full grid-cols-2 gap-6 md:grid-cols-4">
            {options.map((option) => (
              <li key={option.name}>
                <label
                  className={`inline-flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 bg-white p-3 ${
                    selectedObject === option.name
                      ? "border-pink-500 text-pink-500"
                      : "border-gray-200 hover:bg-gray-100 hover:text-pink-500"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.name}
                    className="hidden"
                    checked={selectedObject === option.name}
                    onChange={() => onSelect(option.name)}
                  />
                  <Image src={option.url} alt={option.name} width={70} height={70} />
                  <small className="mt-3 text-center capitalize">{option.name}</small>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
