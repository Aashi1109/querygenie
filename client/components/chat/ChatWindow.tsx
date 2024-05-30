"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import UserChatCard from "@/components/chat/UserChatCard";
import SystemChatCard from "@/components/chat/SystemChatCard";
import { Textarea } from "@/components/ui/textarea";
import TooltipWrapper from "@/components/TooltipWrapper";
import { FileText, SendHorizonal } from "lucide-react";
import { IMessage, IUser } from "@/types";
import { useSession } from "next-auth/react";
import SystemTypingIndicator from "@/components/chat/SystemTypingIndicator";
import {
  createMessage,
  getPromptAnswer,
  getQdrantSearchResult,
  updateMessage,
} from "@/action";
import config, {
  QDRANT_MATCH_THRESHOLD,
  QDRANT_SEARCH_LIMIT,
  QUERY_MODEL_NAME,
} from "@/config";
import { formQueryPrompt } from "@/lib/utils";

const ChatWindow = ({
  chatId,
  collectionId,
  messages,
}: {
  messages: IMessage[];
  chatId: number;
  collectionId: string;
}) => {
  const { data: session } = useSession();

  const userId = (session?.user as IUser).id;

  if (!messages) {
    messages = [];
  }

  const [currentMessages, setCurrentMessages] = useState<IMessage[]>([]);
  const [queryingGPT, setQueryingGPT] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [rows, setRows] = useState(1);
  const [textAreaError, setTextAreaError] = useState<string | null>(null);
  const handleMessageAdd = (message: IMessage) => {
    setCurrentMessages([...currentMessages, message]);
  };
  const handleLocalMessageUpdate = (id: number, answer: string) => {
    setCurrentMessages((prevState) =>
      prevState.map((message) =>
        message.id === id ? { ...message, answer } : message,
      ),
    );
  };

  console.log(currentMessages);

  const handleKeyDown = async (
    e:
      | {
          key: string;
          shiftKey: any;
          preventDefault: () => void;
        }
      | any,
  ) => {
    if (e.key === "Enter" && e.shiftKey) {
      // Expand textarea
      setRows((prevRows) => Math.min(prevRows + 1, 5)); // Increase rows up to a maximum of 5
      e.preventDefault();
    } else if (e.key === "Enter") {
      // Submit form
      e.preventDefault();
      await handleSubmit(e);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission logic
    const enteredQuery = textareaRef.current?.value;

    if (!enteredQuery || enteredQuery?.trim().length === 0) {
      // if (textareaRef.current)
      //   textareaRef.current.style.border = "1px solid red";
      setTextAreaError("Please enter a query");
      return;
    }
    const previousQuery = enteredQuery;

    try {
      // clear text input
      if (textareaRef.current.value) textareaRef.current.value = "";
      const localMessageId = Date.now();
      // add user query card

      let createdMessageId;
      handleMessageAdd({
        id: localMessageId ?? 0,
        query: enteredQuery,
        userId: userId,
        chatId: chatId,
        answer: undefined,
      });

      const createdMessage = await createMessage(chatId, userId, enteredQuery);
      if (createdMessage?.success) {
        //   message created
        createdMessageId = createdMessage?.data?.id;
      }
      setQueryingGPT(true);

      // get embeddings from api
      // perform search from qdrant data
      const searchData = await getQdrantSearchResult(
        enteredQuery,
        config.embeddingModel,
        collectionId,
        QDRANT_SEARCH_LIMIT,
        QDRANT_MATCH_THRESHOLD,
      );
      if (searchData?.success) {
        // create prompt and using it make request to llm for answer
        const messages = formQueryPrompt(enteredQuery, searchData?.data || "");
        const answerResult = await getPromptAnswer(QUERY_MODEL_NAME, messages);

        if (answerResult?.success) {
          const answerFromGPT = answerResult?.data ?? "";

          // update message with answer to show received answer
          handleLocalMessageUpdate(localMessageId, answerFromGPT);
          if (createdMessageId) {
            //   update message
            const updateMessageResult = await updateMessage(
              createdMessageId,
              answerFromGPT,
            );
            if (updateMessageResult?.success) {
              //   message was updated
            }
          }
        }
      }

      // setTimeout(() => {
      //   handleLocalMessageUpdate(localMessageId ?? 0, "Some randeom text");
      // }, 4000);
    } catch (error) {
      console.error(error);
    } finally {
      setQueryingGPT(false);
    }

    // Reset rows after submission if needed
    setRows(1);
  };

  const handleTextareaChange = () => {
    const enteredText = textareaRef.current?.value;
    if (!enteredText || enteredText.trim().length > 0) {
      setTextAreaError(null);
      setRows(1);
      // if (textareaRef.current) textareaRef.current.style.border = "initial";
      return;
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);
  // Use useEffect to update state if the messages prop changes
  useEffect(() => {
    setCurrentMessages(messages);
  }, []);
  return (
    <div className={"translate-y-[-7%] h-full w-full"}>
      <div
        className={
          "w-full sm:max-w-3xl h-full flex flex-col mx-0 sm:mx-auto chat_pane overflow-y-scroll"
        }
      >
        {/*  chat window*/}
        <div className={"flex-1 flex flex-col justify-end py-6 gap-6"}>
          {currentMessages.map((message) => {
            return (
              <React.Fragment key={message.id}>
                {message.query && (
                  <UserChatCard
                    key={"ucc" + message.id}
                    text={message.query ?? ""}
                  />
                )}
                {message?.answer && (
                  <SystemChatCard
                    key={"scc" + message.id}
                    text={message.answer ?? ""}
                  />
                )}
              </React.Fragment>
            );
            // if (message.query && message.answer)
            //   return <SystemChatCard text={message.query} key={message.id} />;
            // else return <UserChatCard text={message.query} key={message.id} />;
          })}
        </div>
        <div ref={messagesEndRef} />
        {queryingGPT && <SystemTypingIndicator />}
      </div>
      <form
        className={
          "fixed max-w-3xl bottom-0 left-[50%] translate-x-[-50%] translate-y-[100%] w-full"
        }
        onSubmit={handleSubmit}
      >
        <Textarea
          className={"px-10 overflow-y-auto min-h-12 pt-3"}
          style={{ resize: "none" }}
          rows={rows}
          // onResize={handleTextareaResize}
          ref={textareaRef}
          onKeyDown={handleKeyDown}
          onChange={handleTextareaChange}
        />
        <TooltipWrapper tooltipText={"Preview file"}>
          <FileText
            className={
              "absolute bottom-3 left-2 cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
            }
            // onClick={handleSubmit}
          />
        </TooltipWrapper>

        <TooltipWrapper tooltipText={"Send query"}>
          <button
            type="submit"
            className={
              "absolute bottom-3 right-3 cursor-pointer opacity-85 hover:opacity-100 transition-opacity"
            }
          >
            <SendHorizonal />
          </button>
        </TooltipWrapper>
      </form>

      {textAreaError && <p className={"text-red-600 mt-2"}>{textAreaError}</p>}
    </div>
  );
};

export default ChatWindow;
