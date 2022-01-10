import React from "react";

import { Link } from "@inertiajs/inertia-react";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeUsers: [],
            messages: [],
            messageInput: "",
            typingUser: null,
            typingTimer: null,
        };
    }

    componentDidMount() {
        this.setState({ messages: this.props.chatData.messages });
        this.messagesEndRef = React.createRef(null);

        window.Echo.join(`room.${this.props.chatData.room}`)
            .here((users) => {
                this.setState({ activeUsers: users });
            })
            .joining((user) => {
                this.setState({
                    activeUsers: [...this.state.activeUsers, user],
                });
            })
            .leaving((user) => {
                this.setState({
                    activeUsers: this.state.activeUsers.filter(
                        (u) => u.id != user.id
                    ),
                });
            })
            .error((error) => {
                console.log("echo:error", error);
            })
            .listen("MessageSent", (e) => {
                this.setState({
                    messages: [...this.state.messages, e],
                });
            })
            .listenForWhisper("typing", (user) => {
                this.setState({ typingUser: user });

                if (this.state.typingTimer) {
                    clearTimeout(this.state.typingTimer);
                }

                this.setState({
                    typingTimer: setTimeout(() => {
                        this.setState({ typingUser: null });
                    }, 3000),
                });
            });
    }

    componentWillUnmount() {
        window.Echo.leave(`room.${this.props.chatData.room}`);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.messages !== this.state.messages) {
            this.scrollToBottom(
                prevState.messages !== undefined &&
                    prevState.messages.length !== 0
                    ? "smooth"
                    : "auto"
            );
        }
    }

    formatDate = (date) => {
        let d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear(),
            hours = "" + d.getHours(),
            min = "" + d.getMinutes();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        if (hours.length < 2) hours = "0" + hours;
        if (min.length < 2) min = "0" + min;

        return [day, month, year].join(".") + " " + hours + ":" + min;
    };

    addMessage(message) {
        axios.post("/message", {
            message: message,
            room: this.props.chatData.room,
        });

        this.setState({
            messages: [
                ...this.state.messages,
                {
                    user: {
                        id: this.props.auth.user.id,
                        name: this.props.auth.user.name,
                    },
                    user_id: this.props.auth.user.id,
                    created_at: new Date().toISOString(),
                    message: message,
                },
            ],
        });
    }

    scrollToBottom = (behavior = "smooth") => {
        this.messagesEndRef.current?.scrollIntoView({ behavior: behavior });
    };

    handleKeyDown = (event) => {
        if (event.key === "Enter") {
            this.addMessage(event.target.value);
            this.setState({ messageInput: "" });
        } else {
            window.Echo.join(`room.${this.props.chatData.room}`).whisper(
                "typing",
                this.props.auth.user
            );
        }
    };

    handleChange = (event) => {
        this.setState({ messageInput: event.target.value });
    };

    render() {
        return (
            <div className="flex items-start dark:bg-gray-800 dark:text-gray-300 text-sm md:text-base ">
                <div className="w-1/3 mx-2 my-4 md:px-4">
                    <div>
                        <span>
                            Active Users ({this.state.activeUsers.length})
                        </span>
                        <div className="overflow-y-scroll h-24 max-w-xs my-2 bg-gray-200 dark:bg-gray-600 rounded-md p-2">
                            {this.state.activeUsers.map((user) => (
                                <li
                                    className="list-none"
                                    key={user.id}
                                >
                                    {user.name}
                                </li>
                            ))}
                        </div>
                    </div>

                    <div className="my-8">
                        <span>Rooms</span>
                        <div className="rounded-md">
                            {this.props.chatData.rooms.map((room, i) => {
                                return (
                                    <Link
                                        key={i}
                                        href={`/chat/${room}`}
                                    >
                                        <li className="list-none p-2 bg-gray-200 dark:bg-gray-600 my-2 rounded-md cursor-pointer">
                                            # {room}
                                        </li>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className=" w-full">
                    <div className="py-2 px-4 sticky border-b-2 border-gray-300">
                        <div className="flex gap-2 items-center">
                            <span className="text-2xl">#</span>
                            <h2 className="text-xl">
                                {this.props.chatData.room}
                            </h2>
                        </div>
                    </div>

                    <div className="h-[30rem] overflow-y-scroll">
                        <div className="flex items-start flex-col">
                            {this.state.messages.map((message, i) => (
                                <div
                                    key={i}
                                    className={`px-4 py-2 m-2 max-w-xs bg-gray-200 dark:bg-gray-600 rounded-xl ${
                                        message.user_id !==
                                        this.props.auth.user.id
                                            ? "rounded-bl-none"
                                            : "rounded-br-none self-end"
                                    } `}
                                >
                                    <div className="flex gap-4 items-center">
                                        <span className="text-md font-bold">
                                            {message.user.name}
                                        </span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold opacity-70">
                                            {this.formatDate(
                                                message.created_at
                                            )}
                                        </span>
                                    </div>
                                    <div className=" text-sm">
                                        <span className="max-w-full break-words">
                                            {message.message}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div ref={this.messagesEndRef} />
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="p-2">
                            <input
                                onKeyDown={this.handleKeyDown}
                                onChange={this.handleChange}
                                className="rounded-md border-none w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:placeholder:text-gray-300"
                                type="text"
                                placeholder="Enter message"
                                value={this.state.messageInput}
                            />
                            <div className="h-6">
                                {this.state.typingUser ? (
                                    <span className="text-sm">
                                        {this.state.typingUser.name} is
                                        typing...
                                    </span>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
