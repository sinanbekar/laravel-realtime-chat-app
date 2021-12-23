import Chat from "@/Components/Chat";
import Authenticated from "@/Layouts/Authenticated";
import { Head } from "@inertiajs/inertia-react";
export default function ChatPage(props) {
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Chat
                </h2>
            }
        >
            <Head title="Chat" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Chat auth={props.auth} chatData={props.chatData} />
                </div>
            </div>
        </Authenticated>
    );
}
