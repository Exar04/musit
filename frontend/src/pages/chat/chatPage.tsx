import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/chatHeader";
import MessageInput from "./components/messageInput";
import { MessageCircleDashed } from "lucide-react";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

export const ChatPage = () => {
	const { user, userId } = useAuth();
	const { messages, selectedUser, fetchUsers, fetchMessages } = useChatStore();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.userId);
	}, [selectedUser, fetchMessages]);

	console.log( "messa : ", messages );

	return (
		<main className='h-full rounded-lg bg-zinc-900/80 overflow-hidden'>
			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-full'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-260px)]'>
								<div className='p-1 space-y-1'>
									{messages.map((message) => (
										<div
											key={message._id}
											className={`flex items-start gap-1 ${
												message.senderId === userId ? "flex-row-reverse" : ""
											}`}
										>
											<Avatar className='size-2'>
												<AvatarImage
													src={
														message.senderId === userId
															? "" // right now we are just keeping it null but later when will add real profile image
															: selectedUser.imageUrl
													}
												/>
											</Avatar>

											<div
												className={`rounded-lg p-2 max-w-[70%]
													${message.senderId === userId ? "bg-green-500/80" : "bg-zinc-800"}
												`}
											>
												<p className='text-sm'>{message.content}</p>
												<span className='text-xs text-zinc-300 mt-1 block'>
													{formatTime(message.createdAt)}
												</span>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<MessageCircleDashed className='size-16 animate-bounce' />
		{/* <img src='/spotify.png' alt='Spotify' className='size-16 animate-bounce' /> */}
		<div className='text-center'>
			<h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);