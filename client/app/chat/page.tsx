import { ChatWindow } from "@/components/chat";
import { createChat, getChatByQuery, getMessagesByQuery } from "@/action";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const projectId = +(searchParams?.projectId as string);
  const userId = +(searchParams?.userId as string);
  // get chatId from projectId
  const chatData = await getChatByQuery({
    projectId: projectId,
    userId: userId,
  });

  let chatId;

  // console.log("chatData -> ", chatData);

  if (!chatData?.data?.length) {
    // chat not present create one
    const chatCreateResult = await createChat(projectId, userId);

    if (chatCreateResult?.success) {
      // chat creation failed
      chatId = chatCreateResult?.data?.id;
    }
  } else {
    //   chat already exists
    if (chatData?.data?.length) chatId = chatData?.data[0]?.id;
  }
  // console.log("chatId -> ", chatId);
  const messagesData = await getMessagesByQuery({ chatId: chatId });
  // console.log("messagesData -> ", messagesData);

  return (
    <ChatWindow
      chatId={chatId}
      messages={messagesData?.data ?? []}
      collectionId={(searchParams?.collectionId as string) ?? ""}
    />
  );
};

export default Page;
