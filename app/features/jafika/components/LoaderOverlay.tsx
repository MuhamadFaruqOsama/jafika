type LoaderOverlayProps = {
  visible: boolean;
};

export function LoaderOverlay({ visible }: LoaderOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-999999999999 flex items-center bg-black/10">
      <div className="spinner mx-auto">
        <div />
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
}
