import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { BoardService } from "../services/board.service";
import { BoardActionTypes } from "./board.action";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppState } from "./board.state";
import * as actions from "./board.action";
import { map, mergeMap, withLatestFrom } from "rxjs";

@Injectable()
export class BoardEffects {
  constructor(
    private boardService: BoardService, 
    private action$: Actions,
    private store$: Store<AppState>
  ) {}

  prepareSystemBoard$ = createEffect(() =>
    this.action$.pipe(
      ofType(BoardActionTypes.PrepareSystemBoard),
      withLatestFrom(this.store$),
      mergeMap(([, state]) => {
        return this.boardService.initializeOpponent(state.board?.opponent?.board, state.board?.numberOfShips || 0)
          .pipe(
            map(data => actions.prepareSystemBoardCompleted({data: data}))
          );
      })      
    )
  );
}
