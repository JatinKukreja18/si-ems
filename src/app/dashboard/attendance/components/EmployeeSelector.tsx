import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployees";
import { NAVIGATIONS } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function EmployeeSelector({ selectedUser }: { selectedUser: string | null | undefined }) {
  const { employeesData } = useEmployees();
  const router = useRouter();
  function onEmployeeChange(emp_id: string) {
    router.replace(NAVIGATIONS.ATTENDANCE + "?user=" + emp_id);
  }
  return (
    <Select value={selectedUser || ""} onValueChange={onEmployeeChange}>
      <SelectTrigger className="w-full sm:w-[200px] text-md bg-white capitalize">
        <SelectValue placeholder="Select Employee" className="capitalize" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {employeesData.map((employee) => (
            <SelectItem key={employee.emp_id} value={employee.id} className="capitalize">
              {employee.name.toLowerCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
