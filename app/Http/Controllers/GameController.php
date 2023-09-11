<?php

namespace App\Http\Controllers;

use App\Http\Resources\GameStateResource;
use App\Http\Resources\RoomResource;
use App\Models\Card;
use App\Models\Game;
use App\Models\GameState;
use App\Models\Move;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

//        $Game->graded = $input['graded']; Production
//        $Game->graded = 1;
//        $Game->players = json_encode(['player1' => $input['player1'],'player2' => $input['player2']]); Production

class GameController extends Controller {
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
     * @return \Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    public function create(Request $request) {
        $Room = $request->session()->get('Room');
        if(is_null($Room))
            return Redirect::route('home');
        $Game = new Game;
        $Game->save();
        $Room->GameId = $Game->id;
        $Room->save();

        return Inertia::render('Game/WaitingRoom/GameWaitingRoom',['Room' => new RoomResource($Room)]);
    }

    protected function otherPlayer($players,$last) {
        return $last === $players['player1'] ? $players['player2'] : $players['player1'];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse|\Illuminate\Http\RedirectResponse|\Inertia\Response
     */
    public function store(Request $request) {
        $input = $request->only(['Room']);
        if(is_null($input['Room']))
            return Redirect::route('home');

        $Room = Room::find($input['Room']);
//            ->session()->get('Room');

        if(!is_null($Room)) {
            $User = $request->user();
            $Active_Game = Game::find($Room->GameId);
            if($Active_Game->hasEnded())
                return Redirect::route('home');
            $First_State = GameState::where('game_id',$Active_Game->id)->where('sequence_number',0)->get();

            if($First_State->isEmpty()) {
                $Active_Game->players = json_encode(['player1' => $Room->Owner()->id,'player2' => $Room->Player()->id]);
                $Active_Game->save();
                $GameState = $this->initiate($Active_Game);
            }
            else
                $GameState = new GameStateResource($First_State[0],null);

            $Player1 = $Room->Owner();
            $Player2 = $Room->Player();

            return Inertia::render('Game/GameCanvas',
                [
//                    'Room' => new RoomResource($Room[0]),
                    'Game'=> $GameState,
                    'Players'=>['Player1'=>$Player1,'Player2'=>$Player2],
                    'GameObject' => $Active_Game,
                ]);
        }
        else
            return Redirect::route('home');
    }

    /**
     * Display the specified resource.
     *
     * @param Game $game
     * @return \Inertia\Response
     */

    protected function nextPlayer($players,$last) {
        return $last === $players->player1 ? $players->player2 : $players->player1;
    }

    public function showWinner(Request $request) {
        $input = $request->only('game_id');
        $Game = Game::find($input['game_id']);
        $Player1 = User::find($Game->players()->player1);
        $Player2 = User::find($Game->players()->player2);
        $has_fled = null;
        $Last_State = GameState::where('game_id',$Game->id)->orderBy('sequence_number', 'desc')->first();
        if($Last_State->status() === "3")
            $has_fled = $this->nextPlayer($Game->players(),$Game->winner);

        if(!is_null($Game->winner)) {
            $Winner = User::find($Game->winner);
            return Inertia::render('Game/WinningScreen',
                ['Game'=>$Game,'Winner'=>$Winner,'Player1'=>$Player1,'Player2'=>$Player2,'has_fled'=>$has_fled]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param Game $game
     * @return Response
     */
    public function edit(Game $game) {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Game $game
     * @return Response
     */
//    public function setCanvasRendered(Request $request) {
//        $input = $request->only('game_id');
//        $Game = Game::find($input['game_id']);
//        $Players = $Game->players();
//        if($request->user()->id === $Players->player1)
//            $Game->OwnerCanvasRendered = true;
//        else if($request->user()->id === $Players->player2)
//            $Game->PlayerCanvasRendered = true;
//
//        $Game->save();
//    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Game $game
     * @return Response
     */
    public function destroy(Game $game) {
        //
    }

    public function initiate(Game $game) {
        if($game->hasEnded())
            Redirect::route('Winner',['game_id'=>$game->id]);

        $players = $game->players();
        $player1 = $players->player1;
        $player2 = $players->player2;

        $cards = Card::split_cards();
        $cards_1 = $cards[0];
        $cards_2 = $cards[1];

        $Initial_State = new GameState;
        $Initial_State->game_id = $game->uuid();
        $Initial_State->sequence_number = 0;
        $Initial_State->is_bluffed = false;
        $Initial_State->cards_down = json_encode(['cards_down'=>[]]);
        $Initial_State->cards_played = json_encode(['cards_played'=>[],'as'=>[]]);
        $Initial_State->bluff_has_been_called = false;
        $Initial_State->player_cards = json_encode(['player1'=>['id'=>$player1,'cards'=>$cards_1], 'player2'=>['id'=>$player2,'cards'=>$cards_2]]);
        $Initial_State->next_player = mt_rand(0,1) ? $player1 : $player2;
        $Initial_State->status = '1';

        $Initial_State->save();

        return new GameStateResource($Initial_State,null);
    }

    public function checkEnemyMove(Request $request) {
        $input = $request->only('GameId');
        $Game = Game::find($input['GameId']);

        if($Game->hasEnded())
            Redirect::route('Winner',['game_id'=>$Game->id]);

        $State = GameState::where('game_id',$input['GameId'])->orderByDesc('sequence_number')->first();
        $Last = Move::where('game_id',$Game->id)->orderByDesc('created_at')->get()->first();
//        if($Last->status() === 2)
//            $Last = Move::where('game_id',$Game->id)->orderByDesc('created_at')->get()[1];

        return Inertia::render('Game/GameCanvas',['Game'=>new GameStateResource($State,$Last),
            'Players'=>['Player1'=>$request->user()->id,'Player2'=>$State->next_player],'GameObject'=>$Game]);
    }
}


//useEffect(() => {
//    const timer = !myTurn && setTimeout(() => {
//        console.log("Checking for new Enemy Move");
//        Inertia.post(route('Check_Enemy_Move'),{GameId:props.Game.game_id,Example:'Example'},{
//            preserveScroll:true,
//                    onSuccess:
//                        (res)=> {
//                res.props.Game && setNewState(res.props.Game);
//                res.props.Game && setMyTurn(true);
//                // console.log("Response",res);
//            }
//                });
//        }, 1000);
//
//        return () => clearTimeout(timer); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
//    }, [Game]);
