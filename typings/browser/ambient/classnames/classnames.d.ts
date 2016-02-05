// Compiled using typings@0.6.6
// Source: https://raw.githubusercontent.com/joemcelroy/DefinitelyTyped/0d64ea1b82ad1d804892ceec14d98a9be85f64fb/classnames/classnames.d.ts
// Type definitions for classnames
// Project: https://github.com/JedWatson/classnames
// Definitions by: Dave Keen <http://www.keendevelopment.ch>, Adi Dahiya <https://github.com/adidahiya>, Jason Killian <https://github.com/JKillian>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare type ClassValue = string | number | ClassDictionary | ClassArray;

interface ClassDictionary {
	[id: string]: boolean;
}

interface ClassArray extends Array<ClassValue> { }

interface ClassNamesFn {
	(...classes: ClassValue[]): string;
}

declare var classNames: ClassNamesFn;

declare module "classnames" {
	export = classNames
}