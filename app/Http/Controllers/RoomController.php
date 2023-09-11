<?php

namespace App\Http\Controllers;

use App\Http\Resources\KickedResource;
use App\Http\Resources\RoomCollection;
use App\Http\Resources\RoomResource;
use App\Models\Kicked;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use function PHPUnit\Framework\isEmpty;

class RoomController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        //
    }

    public static function generateUniqueInvitationLink($length = 30): string   {
        $data_pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+<>?|/[]{}';

        return substr(str_shuffle(str_repeat($data_pool, $length)), 0, $length);
    }
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */

    public function store(Request $request): \Inertia\Response|RedirectResponse {
        $input = $request->only(['Name','Capacity','Password','InviteOnly']);
        $Room = new Room;
        $Room->OwnerId = $request->user()->id;
        $Room->Name = $input['Name'];
        $Room->Capacity = $input['Capacity'];
        $Room->Password = $input['Password'] === '' ? null : $input['Password'];
        $Room->Invitation_Link = '';
        $Room->InviteOnly = $input['InviteOnly'] ?? false;
        $Room->save();
        $Room->Invitation_Link = '/' . $Room->id.'/' . $Room->Password ?: null;
        $Room->save();
        return Redirect::route('Initialize_Game',['RoomId'=>$Room->id])->with('Room',$Room);
    }

    /**
     * Display the specified resource.
     *
     * @param Room $room
     * @return RedirectResponse|\Inertia\Response
     */
    public function Join_By_Link(Request $request) {
        $input = ['RoomId'=>$request->RoomId,'Password'=>$request->Password];
        $Room = Room::find($input['RoomId']);
        if(!is_null($Room))
            if(!strcmp($Room->Password,$input['Password'])) {
                return self::Join($request,true,$input);
            }
            else
                if(strlen($Room->Password) !== 0 && !isset($input['Password']))
                    return Redirect::route('home')->withErrors(['RoomLinkError'=>"This room requires a password and it is not contained in this link!
                    Please make sure the link is correct."]);
                else
                    return Redirect::route('home')->withErrors(['RoomLinkError'=>"The password contained in the link isn't correct !"]);
        return Redirect::route('home')->withErrors(['RoomLinkError'=>"The room is no longer active or it doesn't exist!"]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Room $room
     * @return Response
     */
    public function edit(Room $room) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Room $room
     * @return Response
     */

    public function update(Request $request, Room $room) {
        //
    }
    public function Kick_Player(Request $request) {
        $input = $request->only(['player_to_kick_id','room_id','reason_to_kick']);
        $Room = Room::find($input['room_id']);
        $player_to_kick = User::find($input['player_to_kick_id']);
        if($request->user()->id !== $Room->Owner()->id) {
            return back()->withErrors(['Authorization'=>'You do not have the right to kick this player.']);
        }
        $Room->PlayerId = null;
        $Kicked = new Kicked();
        $Kicked->user_id = $input['player_to_kick_id'];
        $Kicked->room_id = $input['room_id'];
        $Kicked->reason = $input['reason_to_kick'];
        $Kicked->save();
        $Room->save();
        return back();
    }
    /**
     * Remove the specified resource from storage.
     * @param Room $room
     * @return Response|\Inertia\Response
     */
    public function destroy(Request $request)   {
        $input = $request->only(['room_id','home']);
        Room::destroy($input['room_id']);
        if(isset($input['home']))   {
            return Inertia::render('Dashboard',
                ['Rooms'=>fn ()=> new RoomCollection(Room::where('GameActive',0)->get())]);
        }
    }

    public function pollRoom(Request $request) {
        $input = $request->only('RoomId');
        $Room = Room::find($input['RoomId']);
        if(is_null($Room))
            return Redirect::route('home');
        if(!self::BelongsInGame($Room,$request->user())){
            $Was_Kicked = new KickedResource(Kicked::where('user_id',$request->user()->id)->where('room_id',$input['RoomId'])
                ->orderByDesc('created_at')->first());
            return Redirect::route('home')->with(['Kicked'=>$Was_Kicked]);
        }
        return Inertia::render('Game/WaitingRoom/GameWaitingRoom',['Room'=>new RoomResource($Room)]);
    }

    public function setReady(Request $request, Room $room) {
        $User = $request->user()->id;
       if($User === $room->Player1()) {
           $room->Player1Ready = !$room->Player1Ready();
//           if($room->Player1Ready() && $room->Player2Ready()) {
//           }
       }
       elseif($User === $room->Player2()) {
           $room->Player2Ready = !$room->Player2Ready();
//           if($room->Player1Ready() && $room->Player2Ready()) {
//           }
       }
       return false;
    }

    public function Ready(Request $request) {
        $input = $request->only(['RoomId']);
        $Room = Room::find($input['RoomId']);
        if(!self::BelongsInGame($Room,$request->user())) {
            $Was_Kicked = Kicked::where('user_id',$request->user()->id)->where('room_id',$input['RoomId'])->get();
            return Redirect::route('home');
        }
        if($request->user()->id === $Room->Owner()->id) {
            $Room->OwnerReady = true;
            $Room->save();
        }
        else if ($request->user()->id === $Room->Player()->id) {
            $Room->PlayerReady = true;
            $Room->save();
        }
        return Inertia::render('Game/WaitingRoom/GameWaitingRoom',['Room'=>new RoomResource($Room)]);
    }

    public function Join(Request $request,$By_Link = false,$Link_Input=[]) {
        if(!$By_Link)
            $input = $request->only(['RoomId','Password']);
        else
            $input = $Link_Input;
        $Room = Room::find($input['RoomId']);
        if(is_null($Room))
            return Redirect::route('home');
        if(!is_null($Room->Password)) {
            if(is_null($input['Password']))
                return redirect()->back()->withErrors(['Password'=>'Password is Required']);
            else
                if($Room->Password !== $input['Password'])
                    return redirect()->back()->withErrors(['Password'=>'Incorrect Password !']);
        }
        $Room->PlayerId = $request->user()->id;
        $Room->save();
        return Inertia::render('Game/WaitingRoom/GameWaitingRoom',['Room'=>new RoomResource($Room)]);
    }

    public function Leave(Request $request) {
        $input = $request->only(['RoomId']);
        $Room = Room::find($input['RoomId']);
        if($request->user()->id === $Room->Owner()->id) {
            $Room->OwnerId = null;
            if($Room->OwnerReadyBool())
                $Room->OwnerReady = false;
            if(!is_null($Room->Player())) {
                $Room->OwnerId = $Room->Player()->id;
                $Room->PlayerId = null;
                if($Room->PlayerReadyBool()) {
                    $Room->OwnerReady = true;
                    $Room->PlayerReady = false;
                }
                $Room->save();
                return Redirect::route('home');
            }
            if(is_null($Room->Owner()) && is_null($Room->Player()))
                $Room->delete();
            else
                $Room->save();
            return Redirect::route('home');
        }
        else if($request->user()->id === $Room->Player()->id) {
            $Room->PlayerId = null;
            if($Room->PlayerReadyBool())
                $Room->PlayerReady = false;
            if(is_null($Room->Owner()) && is_null($Room->Player()))
                $Room->delete();
            else
                $Room->save();
        }
        return Redirect::route('home');
    }

    public function Activate(Request $request) {
        $input = $request->only(['RoomId']);
        $Room = Room::find($input['RoomId']);
            if(!$Room->Active() && $request->user()->id === $Room->Owner()->id) {
                $Room->GameActive = true;
                $Room->save();
            }
        return Redirect::route('Play',['Room'=>$Room->id]);
//            ->with('Room',$Room);
    }

    public function RedirectIfRoomDoesntExist(Request $request) {
        $input = $request->only(['Room_Id']);
        $Room = Room::find($input['Room_Id']);
        if(is_null($Room))
            return Redirect::route('home');
        else
            return Inertia::render('Game/WaitingRoom/GameWaitingRoom',['Room'=>new RoomResource($Room)]);
    }

    public function BelongsInGame($Room,$User) {
        if((!is_null($Room->Player()) && $Room->Player()->id === $User->id) || ((!is_null($Room->Owner()) && $Room->Owner()->id === $User->id)))
            return true;
        return false;
    }
}
