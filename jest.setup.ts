// Note: This is for fixing errors when running msw
global.setImmediate = global.setImmediate || ((fn: TimerHandler, ...args: any[]) => setTimeout(fn, 0, ...args));
