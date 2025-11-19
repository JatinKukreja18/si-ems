import { Card } from "@/components/ui/card";
import { Employee } from "@/types";
import Link from "next/link";
import { NAVIGATIONS } from "@/lib/constants";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const EmployeeCard = ({ employee }: { employee: Employee }) => {
  const nameArr = employee.name.split(" ");
  console.log(nameArr);
  const initials = employee.name
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <Card className="p-2 gap-1">
      <Link href={NAVIGATIONS.TEAM + "/" + employee.emp_id}>
        <div className="gap-2 flex items-center">
          <Avatar>
            <AvatarImage src={employee.avatar} />
            <AvatarFallback className="p-2">{initials}</AvatarFallback>
          </Avatar>
          <p className="font-semibold capitalize">{employee.name.toLowerCase()}</p>
        </div>
      </Link>
    </Card>
  );
};
