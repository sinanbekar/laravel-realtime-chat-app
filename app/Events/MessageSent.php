<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Room;
use App\Models\Message;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    /**
     * @var \App\Models\User
     */
    protected $user;
    /**
     * @var \App\Models\Room
     */
    protected $room;
    /**
     * @var \App\Models\Message
     */
    protected $message;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(User $user, Room $room, Message $message)
    {
        $this->user = $user;
        $this->room = $room;
        $this->message = $message;
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PresenceChannel("room.{$this->room->name}");
    }
    /**
     * Broadcast with specific data.
     * 
     * @return array
     */
    public function broadcastWith()
    {
        return array_merge($this->message->toArray(), ['user' => $this->user->only('id', 'name')]);
    }
}
