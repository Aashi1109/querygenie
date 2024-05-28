import React from "react";
import ReusableSheet from "@/components/ReusableSheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IUser } from "@/types";
import { capitalize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const UserProfileSheet: React.FC<{
  trigger: React.ReactNode;
  user: IUser;
  triggerAsChild: boolean;
}> = ({ trigger, user, triggerAsChild }) => {
  return (
    <ReusableSheet
      trigger={trigger}
      heading={"User profile"}
      description={"View only details"}
      footer={<Button>Close</Button>}
      triggerAsChild={triggerAsChild}
    >
      <div className="grid gap-4 py-4">
        {Object.entries(user).map((fieldData) => {
          const keyName = fieldData[0];
          const keyValue = fieldData[1];
          const useTextArea = keyValue.length > 30;
          const props = {
            id: keyName,
            value: keyValue || "",
            className: "col-span-3 text-wrap",
            disabled: true,
          };
          return (
            <div className="grid grid-cols-4 items-center gap-4" key={keyName}>
              <Label htmlFor={keyName} className="text-right">
                {capitalize(keyName)}
              </Label>
              {!useTextArea ? <Input {...props} /> : <Textarea {...props} />}
            </div>
          );
        })}
      </div>
    </ReusableSheet>
  );
};

export default UserProfileSheet;
