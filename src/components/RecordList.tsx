import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Eye } from "lucide-react";
import { format } from "date-fns";
import { Role } from "@/generated/prisma/enums";
import { Record, User } from "@/generated/prisma/client";
import Link from "next/link";

type Props = {
  role: Role;
  records: (Record & { createdBy: Pick<User, "email"> })[];
};

const RecordList = ({ role, records }: Props) => {
  return (
    <div className="bg-gray-50">
      <main className="px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              {role === "SENDER" ? (
                <span>My Records</span>
              ) : (
                <span>All Records</span>
              )}
            </CardTitle>
            <CardDescription>
              {role === "SENDER" ? (
                <span>Records you have created ({records.length})</span>
              ) : (
                <span>
                  View all file records from all senders ({records.length}{" "}
                  total)
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg">No records available</p>
                {role === "SENDER" ? (
                  <p className="text-sm">
                    Your records will appear here when you create them
                  </p>
                ) : (
                  <p className="text-sm">
                    Records will appear here when senders create them
                  </p>
                )}
              </div>
            ) : (
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      {role === "RECEIVER" && <TableHead>Created By</TableHead>}
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.fileName}
                        </TableCell>
                        <TableCell className="max-w-60 truncate">
                          {record.description}
                        </TableCell>
                        <TableCell className="capitalize">
                          {record.category[0] +
                            record.category.slice(1).toLowerCase()}
                        </TableCell>
                        {role === "RECEIVER" && (
                          <TableCell>{record.createdBy.email}</TableCell>
                        )}
                        <TableCell>
                          {format(new Date(record.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={record.fileUrl} target="_blank">
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
export default RecordList;
