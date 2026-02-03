import FilePreviewPage from "@/components/pages/FilePreviewPage";

const Page = async ({ params }: { params: Promise<{ key: string }> }) => {
  const { key } = await params;

  return <FilePreviewPage fileKey={key} />;
};
export default Page;
