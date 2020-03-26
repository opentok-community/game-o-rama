/* Maintenance commands */
export const USER_LOG_IN = "login";
export const USER_LOG_OUT = "logout";
export const LOADING = "loading";
export const SAVE_ROOM = "saveRoom";

/* Member commands */
export const ACTOR_JOIN = "actorJoin";
export const ACTOR_PART = "actorPart";

/* Game commands */
export const SAVE_TOPIC = "saveTopic";
export const GAME_START = "startGame";
export const GAME_END = "endGame";
export const ROUND_START = "startRound";
export const ROUND_END = "endRound";

export const ACTOR_NEXT = "nextActor";
export const ACTOR_START = "startActor";
export const ACTOR_STOP = "stopActor";

export const SELECT_WINNER = "selectWinner";

/*
 *  GAME_START
 *    -> ROUND_START
 *       Randomly choose topic
 *       -> SAVE_TOPIC
 *          Pull clues
 *          -> ACTOR_NEXT
 *             Increment actor
 *             Choose random clue
 *
 *  ACTOR_START
 *   1 minute timer starts
 *   isActive = true
 *
 *  ACTOR_STOP
 *  isActive = false
 *    -> ACTOR_START
 *
 *  SELECT_WINNER
 *  isActive = false
 *  Increment score of winner
 *    -> ACTOR_NEXT
 *
 */
