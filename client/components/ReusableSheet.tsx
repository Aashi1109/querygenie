import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";

const ReusableSheet: React.FC<{
  trigger: React.ReactNode;
  heading: string;
  description: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  triggerAsChild: boolean;
}> = (
  { trigger, footer, heading, description, children, triggerAsChild },
  ref,
) => {
  return (
    <Sheet>
      <SheetTrigger asChild={triggerAsChild}>{trigger}</SheetTrigger>
      <SheetContent>
        <SheetHeader className={"text-left"}>
          <SheetTitle>{heading}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
        {footer && (
          <SheetFooter>
            <SheetClose asChild>{footer}</SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ReusableSheet;
