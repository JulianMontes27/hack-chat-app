//contorl all modals in app
import { create } from "zustand";

//type definition
export type ModalType = "create-server";

interface ModalStore {
  modalType: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType) => void;
  onClose: () => void;
  logState: () => void;
}

const useModalStore = create<ModalStore>((set, get) => ({
  modalType: null,
  isOpen: false,
  onOpen: (type) => {
    set({ isOpen: true, modalType: type });
    console.log("State after opening modal:", get());
  },
  onClose: () => {
    set({ isOpen: false, modalType: null });
    console.log("State after closing modal:", get());
  },
  logState: () => console.log("Current state:", get()),
}));

export default useModalStore;
