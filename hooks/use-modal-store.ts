import { Channel, ChannelType, Member, Profile, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "create-server"
  | "invite-member"
  | "edit-server"
  | "manage-members"
  | "create-channel"
  | "leave-server"
  | "delete-server"
  | "delete-channel"
  | "edit-channel"
  | "file-upload"
  | "delete-message";

//items to send in a modal
interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
  member?: Member & {
    profile: Profile;
  };
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
//hook to control all modals
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
