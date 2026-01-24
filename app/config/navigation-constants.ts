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
      plan: "Enterprise",
    },
    {
      name: "My App 2",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "My App 3",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: mapModulesToNavItems(MODULES),
};
