import { Avatar } from "@mantine/core";
import React from "react";

interface Props {}

const Navbar: React.FC<Props> = () => {
  return (
    <div className="bg-blue-200 h-[10vh] py-2">
      <div className="w-3/4 mx-auto flex justify-between items-center">
        <div className="w-full">School Inventory</div>
        <ul className="w-full flex justify-end items-center gap-x-6">
          <Avatar color="cyan" radius="xl">
            MK
          </Avatar>
          <li>Micheal</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
