//contorl all modals in app
import { Channel, ChannelType, Server } from "@prisma/client";
import { create } from "zustand";

//type definition
export type ModalType =
  | "create-server"
  | "invite-member"
  | "edit-server"
  | "manage-members"
  | "create-channel"
  | "leave-server"
  | "delete-server"
  | "delete-channel"
  | "edit-channel";
//items to send in a modal
interface ModalData {
  server?: Server;
  channel?: Channel;
}

interface ModalStore {
  modalType: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  channelType: ChannelType;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  logState: () => void;
}
const useModalStore = create<ModalStore>((set, get) => ({
  modalType: null,
  data: {},
  isOpen: false,
  channelType: ChannelType.TEXT,
  onOpen: (type, data = {}) => {
    set({ isOpen: true, modalType: type, data });
    console.log("State after opening modal:", get());
  },
  onClose: () => {
    set({ isOpen: false, modalType: null });
    console.log("State after closing modal:", get());
  },
  logState: () => console.log("Current state:", get()),
}));

export default useModalStore;
