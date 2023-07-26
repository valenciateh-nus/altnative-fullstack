import contact from "../../misc/content/contact.js";

const textProps = {
  input: {
    placeholder: "Search contact",
  },
  contacts: [
    { ...contact },
    {
      image: null,
      name: "Jane Doe",
      color: "light",
      lastOnline: "Online",
      lastMessage: "Computer users and programmers",
      link: {
        href: "#pablo",
      },
    },
    {
      image: null,
      name: "Mila Skylar",
      color: "light",
      lastOnline: "23 min ago",
      lastMessage: "You can subscribe to receive weekly...",
      link: {
        href: "#pablo",
      },
    },
    {
      image: null,
      name: "Sofia Scarlett",
      color: "light",
      lastOnline: "1 hour ago",
      lastMessage: "It’s an effective resource regardless...",
      link: {
        href: "#pablo",
      },
    },
    {
      image: null,
      name: "Tom Klein",
      color: "light",
      lastOnline: "Offline",
      lastMessage: "Be sure to check it out if your dev pro...",
      link: {
        href: "#pablo",
      },
    },
  ],
};
export default textProps;
