import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateProject from "@/components/form/CreateProject";
import React from "react";

const CreateProjectActionModal: React.FC<{
  dialogOpen?: boolean;
  toggleDialog?: () => void;
}> = ({ dialogOpen, toggleDialog }) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={toggleDialog}>
      {dialogOpen === undefined && (
        <DialogTrigger>
          <Button className={"rounded-full"}>Create Project</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Start by naming and uploading a new file in your project
          </DialogDescription>
        </DialogHeader>
        {/*<CustomCard heading={"Create new project"} description={""}>*/}
        <CreateProject />
        {/*</CustomCard>*/}
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectActionModal;
