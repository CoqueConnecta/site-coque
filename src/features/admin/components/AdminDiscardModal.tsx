type AdminDiscardModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function AdminDiscardModal({ isOpen, onCancel, onConfirm }: AdminDiscardModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">Tem certeza?</h3>
        <p className="mt-2 text-sm text-gray-600">
          Esta acao vai descartar todas as alteracoes pendentes da secao ativa em PT e EN.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Sim, descartar
          </button>
        </div>
      </div>
    </div>
  );
}
