import { AudioWaveform, Command, GalleryVerticalEnd } from "lucide-react";
import { mapModulesToNavItems } from "@/app/config/navigation-utils";
import { MODULES } from "@/app/config/modules-constants";

export const NAVIGATIONS = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "My App 1",
      logo: GalleryVerticalEnd,
      plan: "Option 1",
    },
    {
      name: "My App 2",
      logo: AudioWaveform,
      plan: "Option 2",
    },
    {
      name: "My App 3",
      logo: Command,
      plan: "Option 3",
    },
  ],
  navMain: mapModulesToNavItems(MODULES),
};
