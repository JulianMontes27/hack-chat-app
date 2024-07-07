"use client";

import { useEffect, useState } from "react";

import CreateChannelModal from "@/components/modals/create-channel/create-channel-modal";
import CreateServerModal from "@/components/modals/create-server/create-server-modal";
import DeleteServerModal from "@/components/modals/delete-server/delete-server";
import EditServerModal from "@/components/modals/edit-server/edit-server-modal";
import InviteModal from "@/components/modals/invite/invite-member-modal";
import LeaveServerModal from "@/components/modals/leave-server/leave-server";
import ManageMembersModal from "@/components/modals/manage-members/manage-members-modal";
import DeleteChannelModal from "@/components/modals/delete-channel/delete-channel";
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
      <InviteModal />
      <ManageMembersModal />
      <CreateServerModal />
      <EditServerModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <CreateChannelModal />
    </>
  );
};
