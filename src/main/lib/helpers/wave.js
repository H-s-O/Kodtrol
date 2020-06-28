export default function wave(position = 0, percent = 0, frequency = 2, func = Math.sin) {
  // I'm sure a mathematician will look at this and cringe.
  return ((func(Math.max(-(Math.PI / 2), Math.min((Math.PI * 1.5), frequency * (position * Math.PI) + ((Math.PI / 2) - (Math.PI * percent * frequency))))) + 1) / 2)
};
