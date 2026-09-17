import type { Category } from './types';

const food = [
  'thai', 'pizza', "whatever's in the fridge", 'tacos', 'ramen', 'sushi', 'burgers', 'salad',
  'pasta', 'indian', 'mediterranean', 'korean bbq', 'burritos', 'pho', 'sandwiches',
  'dumplings', 'fried chicken', 'a bowl of cereal', 'eggs on toast', 'curry', 'poke',
  'falafel', 'noodles', 'soup', 'bagels', 'a big salad with everything', 'leftovers',
  'the place you always go', 'the place you never tried', 'breakfast for dinner',
];

const plans = [
  'go for a walk', 'call someone', 'read', 'watch something', 'gym', 'coffee shop', 'stay in',
  'explore a new neighborhood', 'cook something new', 'nap', 'clean one room', 'go to a bookstore',
  'sit outside', 'text the friend you keep meaning to text', 'go for a run', 'museum',
  'bike ride', 'do nothing on purpose', 'write something down', 'take a long shower',
  'go to bed early', 'water the plants', 'stretch for ten minutes', 'make a playlist',
  'go to the park', 'try a new cafe', 'journal', 'play a game', 'learn one new thing', 'go see a movie',
];

const work = [
  'clear the inbox', 'pick the hardest task and start', 'do the easiest task first',
  'take a break and come back', 'make a list', 'reply to the oldest message', 'close every tab',
  'block an hour and go deep', 'write the update you owe someone', 'delete three things from the list',
  'ask the question you keep avoiding', 'review something for someone else', 'plan tomorrow',
  'finish the half-done thing', 'say no to one thing', 'schedule the meeting', 'cancel the meeting',
  'write the doc', 'read the doc', 'timebox it to 25 minutes', 'go for a walk and think',
  'do the boring admin', 'clean your desk', 'update the ticket', 'ship the small thing',
  'stop and eat something', 'set one goal for today', 'log off on time', 'archive everything', 'start anyway',
];

const build = [
  'start with the ui', 'write the data model first', 'just open the file and type something',
  'pick the smallest feature and ship it', 'write the readme first', 'sketch it on paper',
  'delete the dead code', 'write one test', 'fix the ugliest bug', 'rename the confusing thing',
  'make it work, then make it nice', 'hardcode it for now', 'build the happy path only',
  'add the empty state', 'wire up the button', 'make a throwaway prototype', 'refactor the worst file',
  'set up the project and stop', 'copy something that works', 'ship what you have',
  'write the commit message first', 'draw the screens', 'add logging', 'remove a dependency',
  'make the demo', 'build the boring part', 'do the migration', 'write the api first',
  'style it last', 'just start',
];

const anything = [
  'go left', 'go right', 'yes', 'no', 'the first one', 'the second one', 'the cheaper one',
  'the closer one', 'the one you thought of first', 'the one you keep coming back to',
  'flip it and go', 'the new thing', 'the familiar thing', 'later', 'now', 'ask someone',
  'sleep on it, then the first one', 'the simpler one', 'the faster one', 'the one with fewer steps',
  'both, one after the other', 'neither', 'the one that scares you a little', 'the boring one',
  'the one you would tell a friend to pick', 'the one on the left', 'the one on the right',
  'do it today', 'skip it', 'just go',
];

export const SUGGESTIONS: Record<Category, string[]> = { food, plans, work, build, anything };
