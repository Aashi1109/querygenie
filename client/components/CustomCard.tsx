import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CardWithForm: React.FC<{
  heading: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ heading, description, children, footer }) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};

export default CardWithForm;
