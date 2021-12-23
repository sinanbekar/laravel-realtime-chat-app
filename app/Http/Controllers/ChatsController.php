<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Room;
use App\Events\MessageSent;
use Illuminate\Support\Facades\Response;

class ChatsController extends Controller
{
    /**
     * Render chat page with Inertia.
     * 
     * @return \Inertia\Response
     */
    public function renderChat(Request $request, $room = null)
    {
        $rooms = Room::all()->pluck('name')->toArray();
        if ($room === 'general') return redirect()->route('chat');
        if (!$room) $room = "general";
        if (!in_array($room, $rooms)) abort(404);
        return Inertia::render('Chat', [
            'chatData' => [
                'messages' => Room::where('name', $room)->first()->messages()->with('user')->get(),
                'rooms' => $rooms,
                'room' => $room
            ]
        ]);
    }

    /**
     * Handle message post request.
     *  
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'room' => ['required', 'string', 'max:50'],
            'message' => ['required', 'string', 'max:140'],
        ]);
        $user = $request->user();
        $room = Room::where('name', $request->room)->firstOrFail();
        $message = $user->messages()->create([
            'message' => $request->message,
            'room_id' => $room->id
        ]);
        broadcast(new MessageSent($user, $room, $message))->toOthers();
        return Response::json(['ok' => true]);
    }
}
