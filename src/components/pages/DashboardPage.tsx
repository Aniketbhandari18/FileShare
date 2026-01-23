import RecordList from "../RecordList";
import prisma from "@/lib/prisma";
import { Record, User } from "@/generated/prisma/client";
import { getUser } from "@/lib/getUser";
import CreateRecordButton from "../CreateRecordButton";

const DashboardPage = async () => {
  const { userId, role } = await getUser();

  let records: (Record & { createdBy: Pick<User, "email"> })[] = [];

  if (role === "SENDER") {
    records = await prisma.record.findMany({
      where: {
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            email: true,
          },
        },
      },
    });
  } else {
    records = await prisma.record.findMany({
      include: {
        createdBy: {
          select: {
            email: true,
          },
        },
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
