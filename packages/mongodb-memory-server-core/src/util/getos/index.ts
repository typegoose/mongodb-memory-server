// @ts-nocheck
// import * as async from "async";
import * as fs from "fs";
import * as os from "os";
import { join } from "path";

import { exec } from "child_process";
import { promisify } from "util";

// const distros = fs.readFileSync(join(__dirname, "os.json"));

const LSBRegex = {
  name: /^distributor id:[\s]*(.*)$/mi,
  codename: /^codename:[\s]*(.*)$/mi,
  release: /^release:[\s]*(.*)$/mi
}

const OSRegex = {
  name: /^id="?(.*)"?$/mi,
  /** uses VERSION_CODENAME */
  codename: /^version_codename=(.*)$/mi,
  release: /^version_id="?(.*)"?$/mi
}

/**
 * Begin definition of globals.
 */
// let cachedDistro: null | object = null // Store result of getLinuxDistro() after first call

export interface OtherOS {
  os: 'aix'
    | 'android'
    | 'darwin'
    | 'freebsd'
    | 'openbsd'
    | 'sunos'
    | 'win32'
    | 'cygwin' 
    | string;
}

export interface LinuxOS extends OtherOS {
  os: 'linux';
  dist: string;
  release: string;
  codename?: string;
}

export type AnyOS = OtherOS | LinuxOS;

/**
 * Module definition.
 */
export default async function getOS(): Promise<AnyOS> {
  /** Node builtin function for first determinations */
  let osName = os.platform();

  // Linux is a special case.
  if (osName === 'linux') return /* getLinuxDistro(); */await getInfomation();

  return { os: osName };
}

async function getInfomation() {
  const lsb = await promisify(exec)("lsb_release -a"); // exec this for safety, because "/etc/lsb-release" could be changed to another file
  if (lsb.stdout.length <= 0) {
    try {
      const os = await promisify(fs.readFile)("/etc/os-release");

      return parseOS(os.toString());
    } catch (err) {
      if (err?.code === "ENOENT") {
        throw new Error("No Appropiate file was found!\nSupported are: \"lsb_release -a\"(command) and \"/etc/os-release\"")
      }

      throw err;
    }
  }

  return parseLSB(lsb.stdout);
}

function parseLSB(input: string): LinuxOS {
  console.log("parseLSB")
  return {
    os: "linux",
    dist: input.match(LSBRegex.name)?.[1] ?? "unkown",
    codename: input.match(LSBRegex.codename)?.[1],
    release: input.match(LSBRegex.release)?.[1] ?? ""
  }
}

function parseOS(input: string): LinuxOS {
  console.log("parseOS")
  return {
    os: "linux",
    dist: input.match(OSRegex.name)?.[1] ?? "unkown",
    codename: input.match(OSRegex.codename)?.[1],
    release: input.match(OSRegex.release)?.[1] ?? ""
  }
}

// /**
//  * Identify the actual distribution name on a linux box.
//  */
// async function getLinuxDistro (): Promise<LinuxOS> {
//   /**
//    * First, we check to see if this function has been called before.
//    * Since an OS doesn't change during runtime, its safe to cache
//    * the result and return it for future calls.
//    */
//   if (cachedDistro) return cb(null, cachedDistro)

//   /**
//    * We are going to take our list of release files from os.json and
//    * check to see which one exists. It is safe to assume that no more
//    * than 1 file in the list from os.json will exist on a distribution.
//    */
//   getReleaseFile(Object.keys(distros), function (e, file) {
//     if (e) return cb(e)

//     /**
//      * Multiple distributions may share the same release file.
//      * We get our array of candidates and match the format of the release
//      * files and match them to a potential distribution
//      */
//     var candidates = distros[file]
//     var os = { os: 'linux', dist: candidates[0] }

//     fs.readFile(file, 'utf-8', function (e, file) {
//       if (e) return cb(e)

//       /**
//        * If we only know of one distribution that has this file, its
//        * somewhat safe to assume that it is the distribution we are
//        * running on.
//        */
//       if (candidates.length === 1) {
//         return customLogic(os, getName(os.dist), file, function (e, os) {
//           if (e) return cb(e)
//           cachedDistro = os
//           return cb(null, os)
//         })
//       }
//       /**
//        * First, set everything to lower case to keep inconsistent
//        * specifications from mucking up our logic.
//        */
//       file = file.toLowerCase()
//       /**
//        * Now we need to check all of our potential candidates one by one.
//        * If their name is in the release file, it is guarenteed to be the
//        * distribution we are running on. If distributions share the same
//        * release file, it is reasonably safe to assume they will have the
//        * distribution name stored in their release file.
//        */
//       async.each(candidates, function (candidate, done) {
//         var name = getName(candidate)
//         if (file.indexOf(name) >= 0) {
//           os.dist = candidate
//           return customLogic(os, name, file, function (e, augmentedOs) {
//             if (e) return done(e)
//             os = augmentedOs
//             return done()
//           })
//         } else {
//           return done()
//         }
//       }, function (e) {
//         if (e) return cb(e)
//         cachedDistro = os
//         return cb(null, os)
//       })
//     })
//   })() // sneaky sneaky.
// }

// function getName (candidate) {
//   /**
//    * We only care about the first word. I.E. for Arch Linux it is safe
//    * to simply search for "arch". Also note, we force lower case to
//    * match file.toLowerCase() above.
//    */
//   var index = 0
//   var name = 'linux'
//   /**
//    * Don't include 'linux' when searching since it is too aggressive when
//    * matching (see #54)
//    */
//   while (name === 'linux') {
//     name = candidate.split(' ')[index++].toLowerCase()
//   }
//   return name
// }

// /**
//  * Loads a custom logic module to populate additional distribution information
//  */
// function customLogic (os, name, file, cb) {
//   var logic = './logic/' + name + '.js'
//   try { require(logic)(os, file, cb) } catch (e) { cb(null, os) }
// }

// /**
//  * getReleaseFile() checks an array of filenames and returns the first one it
//  * finds on the filesystem.
//  */
// function getReleaseFile (names, cb) {
//   var index = 0 // Lets keep track of which file we are on.
//   /**
//    * checkExists() is a first class function that we are using for recursion.
//    */
//   return function checkExists () {
//     /**
//      * Lets get the file metadata off the current file.
//      */
//     fs.stat(names[index], function (e, stat) {
//       /**
//        * Now we check if either the file didn't exist, or it is something
//        * other than a file for some very very bizzar reason.
//        */
//       if (e || !stat.isFile()) {
//         index++ // If it is not a file, we will check the next one!
//         if (names.length <= index) { // Unless we are out of files.
//           return cb(new Error('No unique release file found!')) // Then error.
//         }
//         return checkExists() // Re-call this function to check the next file.
//       }
//       cb(null, names[index]) // If we found a file, return it!
//     })
//   }
// }
