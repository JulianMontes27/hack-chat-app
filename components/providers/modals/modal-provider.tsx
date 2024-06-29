"use client";

import CreateChannelModal from "@/components/modals/create-channel/create-channel-modal";
import CreateServerModal from "@/components/modals/create-server/create-server-modal";
import DeleteServerModal from "@/components/modals/delete-server/delete-server";
import EditServerModal from "@/components/modals/edit-server/edit-server-modal";
import InviteModal from "@/components/modals/invite/invite-member-modal";
import LeaveServerModal from "@/components/modals/leave-server/leave-server";
import ManageMembersModal from "@/components/modals/manage-members/manage-members-modal";
import DeletChannelModal from "@/components/modals/delete-channel/delete-channel";

import { useEffect, useState } from "react";
import EditChannelModal from "@/components/modals/edit-channel/edit-channel";

export const ModalProvider = () => {
  const [isMounted, setisMounted] = useState(false);
  useEffect(() => {
    setisMounted(true);
  }, []);
  if (!isMounted) {
    //we are still on the server
    return null;
  }
  return (
    <>
      <ManageMembersModal />
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeletChannelModal />
      <EditChannelModal />
    </>
  );
};
