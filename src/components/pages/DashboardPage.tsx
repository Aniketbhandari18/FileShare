import RecordList from "../RecordList";
import prisma from "@/lib/prisma";
import { Prisma, User } from "@/generated/prisma/client";
import { getUser } from "@/lib/getUser";
import CreateRecordButton from "../CreateRecordButton";
import { SafeRecord } from "@/types";
import { safeRecordSelect } from "@/lib/prisma/select";

const DashboardPage = async () => {
  const { userId, role } = await getUser();

  let records: (SafeRecord & { createdBy: Pick<User, "email"> })[] = [];

  const select = {
    ...safeRecordSelect,
    createdBy: {
      select: { email: true },
    },
  } satisfies Prisma.RecordSelect;

  if (role === "SENDER") {
    records = await prisma.record.findMany({
      where: {
        createdById: userId,
      },
      select: select,
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    records = await prisma.record.findMany({
      where: {
        accesses: {
          some: { userId },
        },
      },
      select: select,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <div>
      <div className="flex justify-between text-2xl font-semibold mt-2 ml-4 mr-4">
        <span>Dashboard</span>
        {role === "SENDER" && <CreateRecordButton />}
      </div>

      <RecordList role={role} records={records} />
    </div>
  );
};
export default DashboardPage;
