export interface ModalRef {
  open: () => void;
  close: () => Promise<void>;
  toggle: () => void;
  isOpen: () => boolean;
}
